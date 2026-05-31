import { Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);

interface DeployDockerInput {
  containerName: string;
  image: string;
  serviceSlug: string;
  config: Record<string, unknown>;
}

interface DeployDockerResult {
  containerId: string;
  runtimePath: string;
  envFilePath: string;
  configFilePath: string;
}

@Injectable()
export class DockerEngineService {
  async deploy(input: DeployDockerInput): Promise<DeployDockerResult> {
    const runtimeRoot = path.resolve(
      process.cwd(),
      process.env.DEPLOYMENT_ROOT ?? 'docker/runtime',
    );
    const runtimePath = path.join(runtimeRoot, input.serviceSlug);
    const envFilePath = path.join(runtimePath, '.env');
    const configFilePath = path.join(runtimePath, 'config.json');

    await fs.mkdir(runtimePath, { recursive: true });
    await fs.writeFile(configFilePath, JSON.stringify(input.config, null, 2), 'utf8');
    await fs.writeFile(envFilePath, this.serializeEnv(input.config), 'utf8');

    await this.tryRemoveContainer(input.containerName);
    await this.runDocker(['pull', input.image]);

    const args = [
      'run',
      '-d',
      '--name',
      input.containerName,
      '--restart',
      'unless-stopped',
      '--env-file',
      envFilePath,
      '-v',
      `${runtimePath}:/app/runtime`,
    ];

    if (process.env.DEPLOYMENT_NETWORK) {
      args.push('--network', process.env.DEPLOYMENT_NETWORK);
    }

    args.push(input.image);

    const { stdout } = await this.runDocker(args);

    return {
      containerId: stdout.trim(),
      runtimePath,
      envFilePath,
      configFilePath,
    };
  }

  async stopContainer(containerName: string) {
    await this.runDocker(['stop', containerName]);
  }

  async startContainer(containerName: string) {
    await this.runDocker(['start', containerName]);
  }

  private async tryRemoveContainer(containerName: string) {
    try {
      await this.runDocker(['rm', '-f', containerName]);
    } catch {
      return;
    }
  }

  private async runDocker(args: string[]) {
    return execFileAsync(process.env.DOCKER_BIN ?? 'docker', args, {
      env: process.env,
    });
  }

  private serializeEnv(config: Record<string, unknown>) {
    const lines = Object.entries(config).map(([key, value]) => {
      const envKey = key.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
      const envValue =
        typeof value === 'string' ? value : typeof value === 'number' ? String(value) : JSON.stringify(value);
      return `${envKey}=${envValue}`;
    });

    return `${lines.join('\n')}\n`;
  }
}
