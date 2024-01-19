import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';

const { Toast, Device, Browser ,} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  webViewVersion: string = '';
  latestVersion: string = '120.0.6099.230';

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.getWebViewVersion();
  }

  async getWebViewVersion() {
    try {
      const deviceInfo = await Device['getInfo']();
      const webViewVersion = deviceInfo.webViewVersion;

      if (webViewVersion) {
        this.webViewVersion = webViewVersion;
        console.log('WebView version:', this.webViewVersion);

        // Checking if the device WebView version is the same or higher than the fixed version
        const versionComparison = this.compareVersions(webViewVersion, this.latestVersion);
        
        if (versionComparison === 0) {
          this.showUpToDateMessage();
        } else if (versionComparison < 0) {
          this.showDownloadbutton();
        } else {
          this.showUpToDateMessage();
        }
      } else {
        console.error('WebView version not found');
        this.webViewVersion = 'N/A';
      }
    } catch (error) {
      console.error('Error getting WebView version', error);
      this.webViewVersion = 'N/A';
    }
  }

  async showDownloadbutton() {
    const alert = await this.alertController.create({
      header: 'Update Available',
      message: `A newer version of WebView is available (${this.latestVersion}). Do you want to download it?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Download canceled');
          },
        },
        {
          text: 'Download',
          handler: () => {
            this.downloadWebViewApk();
          },
        },
      ],
    });

    await alert.present();
  }

  async showUpToDateMessage() {
    const alert = await this.alertController.create({
      header: 'Up to Date',
      message: 'You have the latest version of WebView.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async downloadWebViewApk() {
    const apkDownloadUrl = `https://www.apkmirror.com/apk/google-inc/android-system-webview/android-system-webview-${this.latestVersion}-release/android-system-webview-${this.latestVersion}-android-apk-download/download/?key=e033ae07f38544fb71752ac66f035c52c6644ee5&forcebaseapk=true`;

    await Browser['open']({ url: apkDownloadUrl });

    Toast['show']({
      text: 'Downloading WebView APK',
      duration: 'short',
    });
  }

  compareVersions(versionA: string, versionB: string): number {

    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    for (let i = 0; i < partsA.length; i++) {
      if (partsA[i] > partsB[i]) {
        return 1;
      } else if (partsA[i] < partsB[i]) {
        return -1;
      }
    }

    return 0;
  }
}
