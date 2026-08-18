// JASON XIT Engine Bridge & Sound/Haptic System
// Bridges to native Swift WKWebView handlers (jasonxit) and provides Web Audio fallbacks

export type HapticStyle = 'heavy' | 'medium' | 'soft' | 'rigid' | 'vibrate';

declare global {
  interface Window {
    __nativeBridgeInjected?: boolean;
    sendNativeHaptic?: (style: HapticStyle) => void;
    webkit?: {
      messageHandlers?: {
        jasonxit?: {
          postMessage: (message: { type: string; style?: string; message?: string }) => void;
        };
      };
    };
  }
}

// Web Audio synthesizer for tactile & terminal sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick(pitch = 1200) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio autoplay policy
    }
  }

  public playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.45);
    } catch {}
  }

  public playWarn() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playExploitPing(freq: number = 880) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }
}

export const sounds = new SoundEngine();

export function triggerHaptic(style: HapticStyle = 'medium') {
  // 1. Native Swift WKWebView Bridge
  if (typeof window !== 'undefined') {
    if (window.sendNativeHaptic) {
      window.sendNativeHaptic(style);
    } else if (window.webkit?.messageHandlers?.jasonxit) {
      try {
        window.webkit.messageHandlers.jasonxit.postMessage({ type: 'haptic', style });
      } catch {}
    }

    // 2. Navigator vibrate API (Android / Web)
    if ('vibrate' in navigator) {
      try {
        switch (style) {
          case 'heavy':
            navigator.vibrate([40, 20, 40]);
            break;
          case 'rigid':
            navigator.vibrate(30);
            break;
          case 'soft':
            navigator.vibrate(12);
            break;
          case 'vibrate':
            navigator.vibrate([60, 40, 80]);
            break;
          default:
            navigator.vibrate(20);
        }
      } catch {}
    }
  }

  // 3. Audio synthesis click
  switch (style) {
    case 'heavy':
      sounds.playClick(600);
      break;
    case 'soft':
      sounds.playClick(1800);
      break;
    case 'rigid':
      sounds.playClick(1400);
      break;
    default:
      sounds.playClick(1100);
  }
}

export interface KernelProcess {
  pid: number;
  ppid: number;
  uid: number;
  name: string;
  path: string;
  procAddress: string;
  sandboxStatus: 'Root / Unconfined' | 'Container Sandbox' | 'Platform Binary' | 'Escaped';
  memory: string;
  threads: number;
}

export const INITIAL_KERNEL_PROCESSES: KernelProcess[] = [
  {
    pid: 1,
    ppid: 0,
    uid: 0,
    name: 'launchd',
    path: '/sbin/launchd',
    procAddress: '0xfffffff0089a1000',
    sandboxStatus: 'Platform Binary',
    memory: '14.2 MB',
    threads: 8,
  },
  {
    pid: 2841,
    ppid: 1,
    uid: 0,
    name: 'JasonXit.app',
    path: '/Applications/JasonXit.app/JASONXIT',
    procAddress: '0xfffffff009cd3420',
    sandboxStatus: 'Escaped',
    memory: '34.2 MB',
    threads: 12,
  },
  {
    pid: 84,
    ppid: 1,
    uid: 501,
    name: 'SpringBoard',
    path: '/System/Library/CoreServices/SpringBoard.app/SpringBoard',
    procAddress: '0xfffffff007c51920',
    sandboxStatus: 'Platform Binary',
    memory: '185.6 MB',
    threads: 34,
  },
  {
    pid: 124,
    ppid: 1,
    uid: 0,
    name: 'containermanagerd',
    path: '/usr/libexec/containermanagerd',
    procAddress: '0xfffffff0081e2890',
    sandboxStatus: 'Platform Binary',
    memory: '9.4 MB',
    threads: 6,
  },
  {
    pid: 198,
    ppid: 1,
    uid: 501,
    name: 'PosterBoard',
    path: '/Applications/PosterBoard.app/PosterBoard',
    procAddress: '0xfffffff008e1a120',
    sandboxStatus: 'Container Sandbox',
    memory: '64.1 MB',
    threads: 14,
  },
  {
    pid: 312,
    ppid: 1,
    uid: 0,
    name: 'tccd',
    path: '/System/Library/PrivateFrameworks/TCC.framework/Support/tccd',
    procAddress: '0xfffffff007fb90c0',
    sandboxStatus: 'Platform Binary',
    memory: '7.8 MB',
    threads: 5,
  },
  {
    pid: 419,
    ppid: 1,
    uid: 501,
    name: 'MobileSafari',
    path: '/Applications/MobileSafari.app/MobileSafari',
    procAddress: '0xfffffff009124bc0',
    sandboxStatus: 'Container Sandbox',
    memory: '112.4 MB',
    threads: 19,
  },
  {
    pid: 588,
    ppid: 1,
    uid: 501,
    name: 'WhatsApp',
    path: '/var/containers/Bundle/Application/.../WhatsApp.app/WhatsApp',
    procAddress: '0xfffffff0095a88e0',
    sandboxStatus: 'Container Sandbox',
    memory: '98.5 MB',
    threads: 22,
  },
];
