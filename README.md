# CityEcho 🌍

[English](#english) | [Türkçe](#türkçe)

<div id="english"></div>

## English

**CityEcho** is an interactive city guide powered by modern web technologies, allowing users to discover and share their favorite local spots. Built with **Next.js**, it delivers a performance-focused, scalable, and user-friendly experience.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Management-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)

</div>

### 🚀 About the Project

CityEcho transforms how you explore the city. From hidden cafes to vibrant nightlife, it lists detailed information about restaurants, hotels, museums, and more. Users can visualize these places on an interactive map, read community reviews, and share their own experiences.

### ✨ Key Features

*   **🌆 Expanded Horizons:** Now covering **Ankara, İstanbul, İzmir, Antalya, and Bursa**! Explore over 15+ newly curated popular spots across these major cities.
*   **🚣 Activity-Centric Discovery:** It's not just about *places* anymore. Discover experiences and activities like **Gondola Tours**, Camping Spots, and Beach Clubs.
*   **📸 Visual Review System:** Share your story vividly! Users can now attach **high-quality photos** to their reviews, creating a rich visual guide for the community.
*   **⚡ Modern & Sleek UI:** Experience a refined user interface with **city-based filtering** and a redesigned, compact review form that fits perfectly on any screen.
*   **🛡️ Robust Admin Power:** A comprehensive Admin Panel empowers moderators to manage not just places, but also user **reviews** directly—ensuring quality and trust.
*   **🎨 Advanced Image Management:** powered by **Cloudinary** for optimized, secure, and responsive image delivery.
*   **🗺️ Interactive Maps:** Integrated with Leaflet.js for seamless location visualization.

### 🛠️ Tech Stack

Built with industry-standard modern tools:

*   **Core:** Next.js 16 (React, TypeScript)
*   **Database:** PostgreSQL with **Prisma ORM**
*   **Media:** Cloudinary (Storage & Optimization)
*   **Maps:** Leaflet / React-Leaflet
*   **Styling:** Tailwind CSS, Lucide React
*   **Auth:** NextAuth.js

### 🏗️ Installation & Setup

Follow these steps to run the project locally:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/username/cityecho.git
    cd cityecho
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/cityecho"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"

    # Cloudinary Config
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
    ```

4.  **Setup Database**
    ```bash
    npx prisma migrate dev
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000) to start exploring.

### 📂 Database Logic (One-to-Many)

We utilize a robust **One-to-Many** relationship for images, ensuring that places and reviews can have multiple high-quality visuals without cluttering main tables.

```prisma
model Place {
  id      String       @id @default(cuid())
  images  PlaceImage[] // Relation
  reviews Review[]
  // ...
}

model Review {
  id     String        @id @default(cuid())
  images ReviewImage[] // Visual Reviews
  // ...
}
```

---

<div id="türkçe"></div>

## Türkçe

**CityEcho**, modern web teknolojileri ile güçlendirilmiş, kullanıcıların favori mekanlarını keşfetmelerini ve paylaşmalarını sağlayan etkileşimli bir şehir rehberidir. **Next.js** ile geliştirilmiş olup, performans odaklı, ölçeklenebilir ve kullanıcı dostu bir deneyim sunar.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Management-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)

</div>

### 🚀 Proje Hakkında

CityEcho, şehri keşfetme şeklinizi değiştiriyor. Gizli kafelerden canlı gece hayatına kadar restoranlar, oteller, müzeler ve daha fazlası hakkında detaylı bilgiler listeler. Kullanıcılar bu mekanları interaktif bir harita üzerinde görüntüleyebilir, topluluk yorumlarını okuyabilir ve kendi deneyimlerini paylaşabilir.

### ✨ Öne Çıkan Özellikler

*   **🌆 Ufukları Genişlet:** Artık **Ankara, İstanbul, İzmir, Antalya ve Bursa'yı** kapsıyor! Bu büyük şehirlerde özenle seçilmiş 15'ten fazla yeni popüler mekanı keşfedin.
*   **🚣 Aktivite Odaklı Keşif:** Sadece *mekanlar* değil. **Gondol Turları**, Kamp Alanları ve Plaj Kulüpleri gibi deneyim ve aktiviteleri keşfedin.
*   **📸 Görsel Yorum Sistemi:** Hikayenizi canlı bir şekilde paylaşın! Kullanıcılar artık yorumlarına **yüksek kaliteli fotoğraflar** ekleyebilir, topluluk için zengin bir görsel rehber oluşturabilir.
*   **⚡ Modern & Şık Arayüz:** **Şehir bazlı filtreleme** ve her ekrana mükemmel uyum sağlayan yeniden tasarlanmış, kompakt yorum formu ile rafine bir kullanıcı deneyimi yaşayın.
*   **🛡️ Güçlü Admin Yönetimi:** Kapsamlı Admin Paneli, moderatörlerin sadece mekanları değil, kullanıcı **yorumlarını** da doğrudan yönetmesini sağlar — kalite ve güveni garanti eder.
*   **🎨 Gelişmiş Görsel Yönetimi:** Optimize edilmiş, güvenli ve duyarlı görsel sunumu için **Cloudinary** ile güçlendirilmiştir.
*   **🗺️ İnteraktif Haritalar:** Sorunsuz konum görselleştirme için Leaflet.js ile entegre edilmiştir.

### 🛠️ Teknoloji Yığını

Endüstri standardı modern araçlarla oluşturulmuştur:

*   **Çekirdek:** Next.js 16 (React, TypeScript)
*   **Veritabanı:** **Prisma ORM** ile PostgreSQL
*   **Medya:** Cloudinary (Depolama & Optimizasyon)
*   **Harita:** Leaflet / React-Leaflet
*   **Stil:** Tailwind CSS, Lucide React
*   **Kimlik Doğrulama:** NextAuth.js

### 🏗️ Kurulum

Projeyi yerel ortamda çalıştırmak için şu adımları izleyin:

1.  **Depoyu Klonlayın**
    ```bash
    git clone https://github.com/kullaniciadi/cityecho.git
    cd cityecho
    ```

2.  **Bağımlılıkları Yükleyin**
    ```bash
    npm install
    ```

3.  **Çevresel Değişkenleri Ayarlayın**
    Kök dizinde `.env` dosyası oluşturun:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/cityecho"
    NEXTAUTH_SECRET="gizli-anahtar"
    NEXTAUTH_URL="http://localhost:3000"

    # Cloudinary Config
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="cloud-name"
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="upload-preset"
    ```

4.  **Veritabanını Hazırlayın**
    ```bash
    npx prisma migrate dev
    ```

5.  **Uygulamayı Başlatın**
    ```bash
    npm run dev
    ```
    Keşfetmeye başlamak için [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

### 📂 Veritabanı Mantığı (Bire-Çok)

Resimler için sağlam bir **Bire-Çok (One-to-Many)** ilişki kullanıyoruz, böylece mekanlar ve yorumlar ana tabloları şişirmeden birden fazla yüksek kaliteli görsele sahip olabiliyor.

```prisma
model Place {
  id      String       @id @default(cuid())
  images  PlaceImage[] // İlişki
  reviews Review[]
  // ...
}

model Review {
  id     String        @id @default(cuid())
  images ReviewImage[] // Görsel Yorumlar
  // ...
}
```

---
*Geliştirici: Semiha Gökmen*
*Son Güncelleme: 21 Aralık 2024*
