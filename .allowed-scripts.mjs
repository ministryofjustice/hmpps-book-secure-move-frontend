import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'
// FIXME: still need to check each permission individually
export default configureAllowedScripts({
  allowlist: {
    'node_modules/@ffmpeg-installer/darwin-arm64@4.1.5': 'FORBID',
    'node_modules/@ffmpeg-installer/darwin-x64@4.1.0': 'FORBID',
    'node_modules/@ffmpeg-installer/linux-x64@4.1.0': 'FORBID',
    'node_modules/@ffmpeg-installer/linux-arm@4.1.3': 'FORBID',
    'node_modules/@ffmpeg-installer/linux-arm64@4.1.4': 'FORBID',
    'node_modules/@ffmpeg-installer/linux-ia32@4.1.0': 'FORBID',
    'node_modules/@sematext/gc-stats@1.5.8': 'ALLOW',
    // Needed by jest for running tests in watch mode
    'node_modules/fsevents@2.3.2': 'ALLOW',
    // Used if webpack config
    'node_modules/gifsicle@5.3.0': 'ALLOW',
    'node_modules/hmrc-frontend@6.87.0': 'ALLOW',
    // Used if webpack config
    'node_modules/jpegtran-bin@7.0.0': 'ALLOW',
    'node_modules/optipng-bin@7.0.1': 'ALLOW',
    'node_modules/pinst@3.0.0': 'ALLOW',
    // Used if webpack config
    'node_modules/pngquant-bin@9.0.0': 'ALLOW',
    'node_modules/preact@8.5.3': 'FORBID',
    'node_modules/sharp@0.32.6': 'FORBID',
    // Needed by esbuild for watching files during development
    'node_modules/@parcel/watcher@2.5.1': 'ALLOW',
    'node_modules/core-js@3.43.0': 'ALLOW',
  },
})
