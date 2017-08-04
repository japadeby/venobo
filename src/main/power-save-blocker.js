import {powerSaveBlocker as blocker} from 'electron'
import {log} from './log'

export default class powerSaveBlocker {

  static blockId: Number = 0

  /**
   * Block the system from entering low-power (sleep) mode or turning off the
   * display.
   */
  static enable() {
    // If a power saver block already exists, do nothing.
    if (blocker.isStarted(this.blockId)) return

    this.blockId = blocker.start('prevent-display-sleep')
    log(`powerSaveBlocker.enable: ${this.blockId}`)
  }

  /**
   * Stop blocking the system from entering low-power mode.
   */
  static disable() {
    // If a power saver block does not exist, do nothing.
    if (!blocker.isStarted(this.blockId)) return

    blocker.stop(this.blockId)
    log(`powerSaveBlocker.disable: ${this.blockId}`)
  }

}
