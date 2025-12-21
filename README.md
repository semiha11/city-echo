# CityEcho 🌍

**CityEcho**, modern teknolojiler kullanılarak geliştirilmiş, kullanıcıların favori mekanlarını keşfetmesini ve paylaşmasını sağlayan interaktif bir şehir rehberidir. Bu proje, **Next.js**'in gücünü arkasına alarak performans odaklı, ölçeklenebilir ve kullanıcı dostu bir deneyim sunar.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Management-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)

</div>

## 🚀 Proje Hakkında

CityEcho, şehirdeki restoran, kafe, otel, müze ve diğer ilgi çekici mekanların detaylı bir şekilde listelendiği, kullanıcıların bu mekanları harita üzerinde görebildiği ve kendi deneyimlerini paylaşabildiği bir platformdur. 

### Öne Çıkan Özellikler

*   **⚡ Modern Mimari:** Next.js App Router mimarisi ile sunucu taraflı renderlama (SSR) ve istemci taraflı etkileşimlerin (CSR) hibrit kullanımı.
*   **📷 Gelişmiş Görsel Yönetimi (Cloudinary):** Kullanıcılar tarafından yüklenen mekan fotoğraflarının optimizasyonu, boyutlandırılması ve güvenli depolanması **Cloudinary** entegrasyonu ile sağlanmaktadır.
*   **🗄️ Güçlü Veritabanı Yapısı (Prisma & PostgreSQL):** İlişkisel veritabanı yönetimi için **Prisma ORM** kullanılmıştır. Tip güvenliği (Type-safety) sayesinde veri bütünlüğü korunurken, geliştirme süreci hızlandırılmıştır.
*   **🤖 Otomasyon Hazırlığı (n8n):** Proje, **n8n** iş akış otomasyonları düşünülerek tasarlanmıştır. Webhook'lar ve API uç noktaları aracılığıyla dış servislerle (örn: e-posta bildirimleri, sosyal medya paylaşımları) entegre çalışabilir yapıdadır.
*   **🗺️ İnteraktif Harita:** Leaflet.js entegrasyonu ile mekanların konum bazlı görselleştirilmesi.
*   **🔐 Güvenli Kimlik Doğrulama:** NextAuth.js ile güvenli oturum yönetimi.

## 🛠️ Teknoloji Yığını (Tech Stack)

Bu projede endüstri standardı modern araçlar kullanılmıştır:

*   **Frontend & Backend:** Next.js 16 (React, TypeScript)
*   **Veritabanı:** PostgreSQL
*   **ORM:** Prisma
*   **Medya Yönetimi:** Cloudinary
*   **Harita Hizmetleri:** Leaflet / React-Leaflet
*   **UI Kütüphanesi:** Tailwind CSS, Lucide React
*   **Form Yönetimi & Validasyon:** React Hook Form (Opsiyonel: manual state management kullanıldıysa bu kaldırılabilir)

## 🏗️ Kurulum ve Çalıştırma

Projenin yerel ortamda çalıştırılması için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullaniciadi/cityecho.git
cd cityecho
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevresel Değişkenleri Ayarlayın (.env)
Kök dizinde `.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cityecho"
NEXTAUTH_SECRET="gizli-anahtar"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="upload-preset"
```

### 4. Veritabanını Hazırlayın
Prisma şemasını veritabanına uygulayın:

```bash
npx prisma migrate dev
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

## 📂 Veritabanı Şeması (Prisma)

Proje, `Place` ve `PlaceImage` modelleri arasında kurulan **One-to-Many** ilişkisi üzerine kurgulanmıştır. Bu yapı sayesinde bir mekanın birden fazla yüksek çözünürlüklü fotoğrafı Cloudinary üzerinde barındırılırken, referansları veritabanında tutulur.

```prisma
model Place {
  id          String       @id @default(cuid())
  title       String
  description String
  category    Category
  images      PlaceImage[] // İlişki
  // ...diğer alanlar
}

model PlaceImage {
  id      String @id @default(cuid())
  url     String
  placeId String
  place   Place  @relation(fields: [placeId], references: [id], onDelete: Cascade)
}
```

## 🌐 n8n Otomasyon Entegrasyonu

CityEcho, iş akışlarını otomatize etmek için **n8n** ile uyumlu API yapısına sahiptir.

*   **Webhook Desteği:** Yeni bir mekan eklendiğinde tetiklenen webhook'lar.
*   **Bildirimler:** Kullanıcı etkileşimlerinde (yorum, beğeni) otomatik e-posta gönderimi.
*   **Veri Senkronizasyonu:** Belirli periyotlarda veritabanı yedekleme veya raporlama işlemleri.

---
*Geliştirici: Semiha Gökmen*
*Tarih: 21 Aralık 2024*
