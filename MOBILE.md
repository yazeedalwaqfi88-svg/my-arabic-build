# 📱 مستشارك للبناء — Mobile / PWA / Capacitor Guide

This project is now a **Progressive Web App** and ready to be wrapped as a
native **Android** and **iOS** app using **Capacitor**.

---

## 1. Live URLs

- **Preview (always latest):** https://id-preview--682ecec2-91f1-4ef3-9914-2344bb610e56.lovable.app
- **Public deployment:** click **Publish** (top-right in Lovable) to get a
  permanent `https://<your-slug>.lovable.app` URL.
- **GitHub repository:** connect via **Lovable → ⋯ → GitHub → Connect Project**.
  Lovable will create the repo on your account; the URL appears in the same menu.

---

## 2. Download the source code

**Option A — GitHub (recommended)**
1. In Lovable, open the **GitHub** menu (top bar) → **Connect to GitHub**.
2. Authorize the Lovable GitHub app and pick an account/org.
3. Click **Create Repository**. Lovable pushes the full codebase.
4. On your machine:
   ```bash
   git clone https://github.com/<you>/<repo>.git
   cd <repo>
   npm install
   ```

**Option B — Direct download (paid workspaces)**
1. Open the **Code Editor** in Lovable.
2. Click **Download codebase** at the bottom of the file tree.
3. Unzip and `npm install`.

---

## 3. PWA (installable web app)

Already wired up:
- `public/manifest.webmanifest` — name, icons, theme, RTL.
- App icons: `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.
- `<link rel="manifest">`, `theme-color`, and Apple meta tags in the root route.
- Arabic RTL and Dark Mode are preserved on mobile (`<html lang="ar" dir="rtl">` + theme toggle stored in `localStorage`).
- A bottom tab bar appears on small screens for native-like navigation.

**Install on a phone:**
- **Android (Chrome):** Menu → *Add to Home screen*.
- **iOS (Safari):** Share → *Add to Home Screen*.

> Offline support: basic asset caching is delegated to the browser. For full
> offline mode, wrap with Capacitor (below) — the entire web bundle ships
> inside the native app, so it works without the network.

---

## 4. Capacitor — Android & iOS native wrappers

`capacitor.config.ts` is already in the repo. Run these locally **after**
downloading the code.

### 4.1 Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios \
  @capacitor/splash-screen @capacitor/status-bar
```

### 4.2 Build the web bundle

```bash
npm run build      # produces ./dist
```

### 4.3 Add the native platforms

```bash
npx cap add android
npx cap add ios       # macOS + Xcode only
npx cap sync
```

This generates the `android/` (Android Studio project) and `ios/` (Xcode
workspace) folders. Re-run `npx cap sync` every time you change web code.

### 4.4 Open in IDEs

```bash
npx cap open android   # Android Studio
npx cap open ios       # Xcode (macOS)
```

---

## 5. Generate an APK (Android)

**Via Android Studio (easiest):**
1. `npm run build && npx cap sync android && npx cap open android`
2. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`.

**Via command line:**
```bash
cd android
./gradlew assembleDebug         # debug APK
./gradlew assembleRelease       # release APK (needs signing config)
./gradlew bundleRelease         # AAB for Google Play
```

**Signing for the Play Store:**
1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore release.keystore -alias mostasharak \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add to `android/key.properties` and reference it from
   `android/app/build.gradle` (`signingConfigs.release`).
3. `./gradlew bundleRelease` → upload the `.aab` to **Google Play Console**.

---

## 6. Generate an IPA (iOS)

Requires **macOS + Xcode + Apple Developer account ($99/yr)**.

1. `npm run build && npx cap sync ios && npx cap open ios`
2. In Xcode: select the **App** target → **Signing & Capabilities** → pick your Team.
3. Choose **Any iOS Device (arm64)** as the build target.
4. **Product → Archive**.
5. In the Organizer window: **Distribute App → App Store Connect** (for the
   App Store) or **Ad Hoc / Development** (for an `.ipa` file on disk).

---

## 7. Publishing checklists

**Google Play Store**
- App icon 512×512, feature graphic 1024×500.
- Privacy policy URL.
- Screenshots (phone + 7" tablet).
- Content rating questionnaire.
- Upload signed `.aab` to Play Console → Internal testing → Production.

**Apple App Store**
- App icon 1024×1024 (no transparency).
- Screenshots for required device sizes (6.7", 6.5", 5.5", iPad).
- Privacy policy URL + App Privacy answers.
- Upload via Xcode Organizer → App Store Connect → submit for review.

---

## 8. Updating the app

- Web/UI changes: edit in Lovable → `npm run build && npx cap sync` → rebuild in Android Studio / Xcode.
- Native config (icons, splash, permissions): edit inside `android/` or `ios/` then rebuild.
