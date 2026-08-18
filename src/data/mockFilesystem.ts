import { FSItem, AppEntry } from '../types';

export const INITIAL_APPS: AppEntry[] = [
  {
    id: 'app-mha-c2',
    name: 'MHA: The Strongest Hero (C2)',
    bundleId: 'com.sony.mha.c2',
    version: '1.8.5',
    category: 'Games & Action',
    dataPath: '/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4',
    bundlePath: '/var/containers/Bundle/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4/mha-c2.app',
    size: '3.42 GB',
    icon: 'Terminal',
  },
  {
    id: 'app-jx',
    name: 'JASON XIT',
    bundleId: 'com.jasonxit.engine',
    version: '2.0.0',
    category: 'System / Utility',
    dataPath: '/var/mobile/Containers/Data/Application/09E9B685-7456-4856-9C10-47DF26B76C33',
    bundlePath: '/Applications/JasonXit.app',
    size: '18.4 MB',
    icon: 'Terminal',
  },
  {
    id: 'app-filza',
    name: 'Filza File Manager',
    bundleId: 'com.tigisoftware.Filza',
    version: '4.0.1',
    category: 'File Manager',
    dataPath: '/var/mobile/Containers/Data/Application/1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D',
    bundlePath: '/Applications/Filza.app',
    size: '32.1 MB',
    icon: 'Folder',
  },
  {
    id: 'app-trollstore',
    name: 'TrollStore',
    bundleId: 'com.opa334.TrollStore',
    version: '2.1.0',
    category: 'Package Manager',
    dataPath: '/var/mobile/Containers/Data/Application/F1E2D3C4-B5A6-7890-1234-56789ABCDEF0',
    bundlePath: '/Applications/TrollStore.app',
    size: '12.8 MB',
    icon: 'Package',
  },
  {
    id: 'app-safari',
    name: 'Safari',
    bundleId: 'com.apple.mobilesafari',
    version: '18.0',
    category: 'Browser',
    dataPath: '/var/mobile/Containers/Data/Application/A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
    bundlePath: '/Applications/MobileSafari.app',
    size: '142.5 MB',
    icon: 'Compass',
  },
  {
    id: 'app-whatsapp',
    name: 'WhatsApp',
    bundleId: 'net.whatsapp.WhatsApp',
    version: '24.2.75',
    category: 'Social / Messaging',
    dataPath: '/var/mobile/Containers/Data/Application/8B9C0D1E-2F3A-4B5C-6D7E-8F9A0B1C2D3E',
    bundlePath: '/var/containers/Bundle/Application/8B9C0D1E-2F3A-4B5C-6D7E-8F9A0B1C2D3E/WhatsApp.app',
    size: '215.3 MB',
    icon: 'MessageSquare',
  },
  {
    id: 'app-instagram',
    name: 'Instagram',
    bundleId: 'com.burbn.instagram',
    version: '318.0.0',
    category: 'Social Media',
    dataPath: '/var/mobile/Containers/Data/Application/4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F',
    bundlePath: '/var/containers/Bundle/Application/4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F/Instagram.app',
    size: '340.2 MB',
    icon: 'Instagram',
  },
  {
    id: 'app-spotify',
    name: 'Spotify',
    bundleId: 'com.spotify.client',
    version: '8.9.12',
    category: 'Music & Audio',
    dataPath: '/var/mobile/Containers/Data/Application/9A8B7C6D-5E4F-3A2B-1C0D-EF9876543210',
    bundlePath: '/var/containers/Bundle/Application/9A8B7C6D-5E4F-3A2B-1C0D-EF9876543210/Spotify.app',
    size: '185.0 MB',
    icon: 'Music',
  },
  {
    id: 'app-discord',
    name: 'Discord',
    bundleId: 'com.hammerandchisel.discord',
    version: '220.0',
    category: 'Social & Voice',
    dataPath: '/var/mobile/Containers/Data/Application/7E6D5C4B-3A2F-1E0D-9C8B-7A6F5E4D3C2B',
    bundlePath: '/var/containers/Bundle/Application/7E6D5C4B-3A2F-1E0D-9C8B-7A6F5E4D3C2B/Discord.app',
    size: '198.7 MB',
    icon: 'Bot',
  },
  {
    id: 'app-youtube',
    name: 'YouTube',
    bundleId: 'com.google.ios.youtube',
    version: '19.08.2',
    category: 'Video & Entertainment',
    dataPath: '/var/mobile/Containers/Data/Application/3D2C1B0A-9F8E-7D6C-5B4A-3F2E1D0C9B8A',
    bundlePath: '/var/containers/Bundle/Application/3D2C1B0A-9F8E-7D6C-5B4A-3F2E1D0C9B8A/YouTube.app',
    size: '280.4 MB',
    icon: 'PlayCircle',
  },
];

export const VIRTUAL_FILESYSTEM: Record<string, FSItem[]> = {
  '/var/mobile': [
    { name: 'Containers', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 12:44', type: 'directory' },
    { name: 'Documents', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-15 09:12', type: 'directory' },
    { name: 'Downloads', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 04:22', type: 'directory' },
    { name: 'Library', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 18:30', type: 'directory' },
    { name: 'Media', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 21:05', type: 'directory' },
    {
      name: '.bash_history',
      isDirectory: false,
      size: '1.2 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-16 23:11',
      type: 'text',
      content: `# JasonXit Terminal History
whoami
uname -a
kexploit_opa334 --status
ls -la /var/mobile/Containers/Data/Application
cat /var/mobile/Library/Preferences/com.jasonxit.engine.plist
filza_inject --root
ps aux | grep launchd
`,
    },
    {
      name: 'device_info.json',
      isDirectory: false,
      size: '864 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:40',
      type: 'json',
      content: JSON.stringify(
        {
          deviceModel: 'iPhone16,2 (iPhone 15 Pro Max)',
          architecture: 'arm64e',
          osVersion: 'iOS 17.5.1 (Build 21F90)',
          kernelVersion: 'Darwin Kernel Version 23.5.0: xnu-10063.121.3~3/RELEASE_ARM64_T8130',
          jailbreakStatus: 'Semi-Jailbreak / Kernel R/W via kexploit_opa334',
          pageTableBase: '0x180000000',
          sandboxStatus: 'Escaped (Sandbox root elevation active)',
          jasonXitVersion: '2.0.0 (Build 2026.08)',
        },
        null,
        2
      ),
    },
  ],

  '/var/mobile/Documents': [
    {
      name: 'Notes.txt',
      isDirectory: false,
      size: '512 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-16 10:15',
      type: 'text',
      content: `JASON XIT - Customization Engine Notes
- PosterBoard wallpapers extracted to /var/mobile/Library/PosterBoard
- Sandbox escape successful via opa334 kernel primitive
- Filza bridge linked at /var/mobile/Documents
- Keep license key backed up in secure enclave!`,
    },
    {
      name: 'tweaks_manifest.plist',
      isDirectory: false,
      size: '2.1 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-16 19:40',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>EnabledTweaks</key>
    <array>
        <string>PosterBoardCustomLockscreen</string>
        <string>FilzaRootSandboxExtension</string>
        <string>DynamicIslandMod</string>
        <string>ControlCenterRedGlow</string>
    </array>
    <key>EngineConfiguration</key>
    <dict>
        <key>AutoActivateOnBoot</key>
        <true/>
        <key>NeonRedGlowFX</key>
        <true/>
        <key>KernelRWMethod</key>
        <string>kexploit_opa334_smrptr</string>
    </dict>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Downloads': [
    {
      name: 'Cipher_Wallpaper_Pack.zip',
      isDirectory: false,
      size: '4.8 MB',
      permissions: 'rw-r--r--',
      modified: '2026-08-15 16:30',
      type: 'binary',
      content: '[Binary ZIP Archive: Wallpaper descriptors & CAML layers for iOS PosterBoard]',
    },
    {
      name: 'FilzaApplySandboxExt.plist',
      isDirectory: false,
      size: '1.4 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 02:11',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ExtensionType</key>
    <string>com.apple.sandbox.container</string>
    <key>TargetPID</key>
    <integer>0</integer>
    <key>PrivilegeLevel</key>
    <string>RootAccessElevated</string>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Library': [
    { name: 'Caches', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 01:00', type: 'directory' },
    { name: 'Preferences', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:12', type: 'directory' },
    { name: 'PosterBoard', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 11:20', type: 'directory' },
    { name: 'SyncedPreferences', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 08:30', type: 'directory' },
  ],

  '/var/mobile/Library/Preferences': [
    {
      name: 'com.jasonxit.engine.plist',
      isDirectory: false,
      size: '1.8 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:00',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>AppVersion</key>
    <string>2.0.0</string>
    <key>AutoActivateEngine</key>
    <true/>
    <key>ThemeNeonRed</key>
    <true/>
    <key>ExpirationWarningNotification</key>
    <true/>
    <key>LastLicenseCheck</key>
    <string>2026-08-17T06:00:00Z</string>
</dict>
</plist>`,
    },
    {
      name: 'com.apple.springboard.plist',
      isDirectory: false,
      size: '3.4 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 03:20',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>SBShowBatteryPercentage</key>
    <true/>
    <key>SBAllowHomeCameraShortcut</key>
    <true/>
    <key>SBControlCenterEnabled</key>
    <true/>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Library/PosterBoard': [
    {
      name: 'RuntimeSnapshotMetadata-home.plist',
      isDirectory: false,
      size: '1.1 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-16 11:20',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>SnapshotRole</key>
    <string>HomeScreen</string>
    <key>DescriptorID</key>
    <string>09E9B685-7456-4856-9C10-47DF26B76C33</string>
    <key>Resolution</key>
    <string>1290x2796</string>
</dict>
</plist>`,
    },
    {
      name: 'Wallpaper.plist',
      isDirectory: false,
      size: '2.5 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-16 11:20',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Author</key>
    <string>mightycooldude12 / JasonXit</string>
    <key>Theme</key>
    <string>Cipher WWDC Neon Edition</string>
    <key>Version</key>
    <integer>1</integer>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Media': [
    { name: 'DCIM', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 21:05', type: 'directory' },
    { name: 'Photos', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 21:05', type: 'directory' },
    { name: 'Recordings', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-12 14:10', type: 'directory' },
  ],

  '/var/mobile/Containers': [
    { name: 'Data', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 12:44', type: 'directory' },
    { name: 'Shared', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 12:44', type: 'directory' },
  ],

  '/var/mobile/Containers/Data': [
    { name: 'Application', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 12:44', type: 'directory' },
  ],

  '/var/mobile/Containers/Data/Application': [
    { name: 'E84A12BC-33F1-4A92-BD81-893C2A9B11E4', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    { name: '09E9B685-7456-4856-9C10-47DF26B76C33', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:30', type: 'directory' },
    { name: '1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 20:10', type: 'directory' },
    { name: 'F1E2D3C4-B5A6-7890-1234-56789ABCDEF0', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 22:45', type: 'directory' },
    { name: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 04:12', type: 'directory' },
    { name: '8B9C0D1E-2F3A-4B5C-6D7E-8F9A0B1C2D3E', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:15', type: 'directory' },
    { name: '4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 01:50', type: 'directory' },
    { name: '9A8B7C6D-5E4F-3A2B-1C0D-EF9876543210', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 19:20', type: 'directory' },
    { name: '7E6D5C4B-3A2F-1E0D-9C8B-7A6F5E4D3C2B', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 23:05', type: 'directory' },
    { name: '3D2C1B0A-9F8E-7D6C-5B4A-3F2E1D0C9B8A', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 02:40', type: 'directory' },
  ],

  // JASONXIT App Container
  '/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4': [
    { name: 'Documents', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    { name: 'Library', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    { name: 'tmp', isDirectory: true, permissions: 'rwxrwxrwx', modified: '2026-08-17 06:10', type: 'directory' },
    {
      name: '.com.apple.mobile_container_manager.metadata.plist',
      isDirectory: false,
      size: '980 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 06:10',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>MCMMetadataIdentifier</key>
    <string>com.sony.mha.c2</string>
    <key>MCMMetadataUUID</key>
    <string>E84A12BC-33F1-4A92-BD81-893C2A9B11E4</string>
    <key>MCMCategory</key>
    <integer>1</integer>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4/Documents': [
    { name: 'SaveData', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    { name: 'Config', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    {
      name: 'GameConfig.json',
      isDirectory: false,
      size: '4.2 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 06:10',
      type: 'json',
      content: JSON.stringify(
        {
          gameId: 'mha-c2',
          title: 'My Hero Academia: The Strongest Hero (C2)',
          targetFPS: 120,
          resolutionScale: 1.0,
          antiAliasing: 'MSAA_4X',
          highPerformanceMode: true,
          lowLatencyInput: true,
        },
        null,
        2
      ),
    },
  ],

  '/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4/Library': [
    { name: 'Preferences', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    { name: 'Caches', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 06:10', type: 'directory' },
    {
      name: 'com.sony.mha.c2.plist',
      isDirectory: false,
      size: '1.2 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 06:10',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>AppBundleIdentifier</key>
    <string>com.sony.mha.c2</string>
    <key>ServerCluster</key>
    <string>C2-Global-Prod</string>
    <key>GraphicsPreset</key>
    <string>UltraHigh60</string>
</dict>
</plist>`,
    },
  ],

  // JASONXIT App Container
  '/var/mobile/Containers/Data/Application/09E9B685-7456-4856-9C10-47DF26B76C33': [
    { name: 'Documents', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:30', type: 'directory' },
    { name: 'Library', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:30', type: 'directory' },
    { name: 'tmp', isDirectory: true, permissions: 'rwxrwxrwx', modified: '2026-08-17 05:30', type: 'directory' },
    {
      name: '.com.apple.mobile_container_manager.metadata.plist',
      isDirectory: false,
      size: '950 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:30',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>MCMMetadataIdentifier</key>
    <string>com.jasonxit.engine</string>
    <key>MCMMetadataUUID</key>
    <string>09E9B685-7456-4856-9C10-47DF26B76C33</string>
    <key>MCMCategory</key>
    <integer>1</integer>
</dict>
</plist>`,
    },
  ],

  '/var/mobile/Containers/Data/Application/09E9B685-7456-4856-9C10-47DF26B76C33/Library': [
    { name: 'Preferences', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:30', type: 'directory' },
    { name: 'Caches', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:30', type: 'directory' },
    {
      name: 'license_cache.json',
      isDirectory: false,
      size: '240 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:30',
      type: 'json',
      content: JSON.stringify(
        {
          licenseType: 'VIP_UNLIMITED_PRO',
          hardwareBound: true,
          activationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          validUntil: '2026-09-17T06:00:00Z',
        },
        null,
        2
      ),
    },
  ],

  // WhatsApp Container
  '/var/mobile/Containers/Data/Application/8B9C0D1E-2F3A-4B5C-6D7E-8F9A0B1C2D3E': [
    { name: 'Documents', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:15', type: 'directory' },
    { name: 'Library', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:15', type: 'directory' },
    { name: 'tmp', isDirectory: true, permissions: 'rwxrwxrwx', modified: '2026-08-17 05:15', type: 'directory' },
    {
      name: '.com.apple.mobile_container_manager.metadata.plist',
      isDirectory: false,
      size: '920 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:15',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>MCMMetadataIdentifier</key>
    <string>net.whatsapp.WhatsApp</string>
    <key>MCMMetadataUUID</key>
    <string>8B9C0D1E-2F3A-4B5C-6D7E-8F9A0B1C2D3E</string>
</dict>
</plist>`,
    },
    {
      name: 'ChatStorage.sqlite',
      isDirectory: false,
      size: '48.2 MB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:14',
      type: 'binary',
      content: '[Encrypted SQLite3 Database: WhatsApp Chat Sessions, Media Pointers, Contacts]',
    },
  ],

  // Instagram Container
  '/var/mobile/Containers/Data/Application/4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F': [
    { name: 'Documents', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 01:50', type: 'directory' },
    { name: 'Library', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 01:50', type: 'directory' },
    {
      name: '.com.apple.mobile_container_manager.metadata.plist',
      isDirectory: false,
      size: '930 B',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 01:50',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>MCMMetadataIdentifier</key>
    <string>com.burbn.instagram</string>
    <key>MCMMetadataUUID</key>
    <string>4C5D6E7F-8A9B-0C1D-2E3F-4A5B6C7D8E9F</string>
</dict>
</plist>`,
    },
  ],

  '/Applications': [
    { name: 'JasonXit.app', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-17 05:00', type: 'directory' },
    { name: 'Filza.app', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 20:00', type: 'directory' },
    { name: 'TrollStore.app', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-16 22:00', type: 'directory' },
    { name: 'MobileSafari.app', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 00:00', type: 'directory' },
    { name: 'Preferences.app', isDirectory: true, permissions: 'rwxr-xr-x', modified: '2026-08-14 00:00', type: 'directory' },
  ],

  '/Applications/JasonXit.app': [
    {
      name: 'Info.plist',
      isDirectory: false,
      size: '3.1 KB',
      permissions: 'rw-r--r--',
      modified: '2026-08-17 05:00',
      type: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>JASON XIT</string>
    <key>CFBundleIdentifier</key>
    <string>com.jasonxit.engine</string>
    <key>CFBundleShortVersionString</key>
    <string>2.0.0</string>
    <key>CFBundleVersion</key>
    <string>20260817</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
</dict>
</plist>`,
    },
    {
      name: 'JASONXIT',
      isDirectory: false,
      size: '12.4 MB',
      permissions: 'rwxr-xr-x',
      modified: '2026-08-17 05:00',
      type: 'binary',
      content: '[Mach-O 64-bit arm64e executable binary with kexploit & XPF engine]',
    },
  ],
};
