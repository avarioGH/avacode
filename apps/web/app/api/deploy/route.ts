import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      botToken,
      ownerId,
      gateway,
      paydisiniKey,
      pakasirKey,
      pakasirSecret
    } = body;

    if (!serviceId || !botToken || !ownerId) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap.' }, { status: 400 });
    }

    // 1. Setup path direktori
    const rootDir = process.cwd(); // Posisi di apps/web
    // Karena kita ada di dalam workspace monorepo, kita mundur ke root
    const workspaceRoot = path.join(rootDir, '../../');
    const templateDir = path.join(workspaceRoot, 'templates', 'bot-order-tele');
    const deploymentsDir = path.join(workspaceRoot, 'deployments');
    const clientDeployDir = path.join(deploymentsDir, serviceId);

    // 2. Buat folder deployments jika belum ada
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // 3. Buat folder client bot
    if (!fs.existsSync(clientDeployDir)) {
      fs.mkdirSync(clientDeployDir, { recursive: true });
    }

    // 4. Salin kode template ke folder client (Hanya menyalin src untuk MVP lokal)
    const srcTemplate = path.join(templateDir, 'src');
    const srcDest = path.join(clientDeployDir, 'src');
    
    if (fs.existsSync(srcTemplate)) {
      // Rekursif copy folder src (sederhana)
      fs.cpSync(srcTemplate, srcDest, { recursive: true });
    } else {
      console.warn('Template src tidak ditemukan, membuat folder kosong untuk mockup.');
      fs.mkdirSync(srcDest, { recursive: true });
      fs.writeFileSync(path.join(srcDest, 'index.js'), 'console.log("Bot berjalan!");');
    }

    // 5. Generate isi file .env
    let envContent = `BOT_TOKEN=${botToken}
BOT_USERNAME=BotPelanggan
OWNER_IDS=${ownerId}
NODE_ENV=production
PORT=3000
DATABASE_URL=sqlite://./data/database.sqlite
`;

    if (gateway === 'paydisini') {
      envContent += `\nPAYDISINI_API_KEY=${paydisiniKey}\nPAYDISINI_CHANNELS=QRIS,DANA,OVO,GOPAY,SHOPEEPAY`;
    } else if (gateway === 'pakasir') {
      envContent += `\nPAKASIR_API_KEY=${pakasirKey}\nPAKASIR_CALLBACK_SECRET=${pakasirSecret}`;
    }

    // 6. Simpan .env ke folder client bot
    fs.writeFileSync(path.join(clientDeployDir, '.env'), envContent);

    // 7. Simulasikan startup process (Di VPS asli kita jalankan child_process.spawn atau pm2)
    // Untuk pengembangan lokal di Windows, kita pura-pura delay 2 detik seolah-olah npm install & node berjalan.
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Menulis log simulasi
    fs.writeFileSync(path.join(clientDeployDir, 'pm2.log'), `Bot started successfully with PM2/Docker wrapper at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Bot deployed successfully', 
      deploymentPath: clientDeployDir 
    });

  } catch (error: any) {
    console.error('Deployment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
