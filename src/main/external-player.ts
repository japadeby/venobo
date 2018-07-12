import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as vlcCommand from 'vlc-command';

import { EXTERNAL_PLAYER_NOT_FOUND } from '../common/events';
import { Venobo } from './main';

export class ExternalPlayer {

    private proc: ChildProcess | null = null;

    constructor(private readonly venobo: Venobo, private readonly playerPath: string) {}

    public checkInstall() {
        // check for VLC if external player has not been specified by the user
        // otherwise assume the player is installed
        return new Promise(resolve => {
            if (!this.playerPath) return vlcCommand(resolve);
            process.nextTick(() => resolve());
        });
    }

    public spawn(url: string, title: string) {
        if (!this.playerPath) return this.spawnExternal([url]);

        // Try to find and use VLC if external player is not specified
        vlcCommand((err: any, vlcPath: string) => {
            if (err) return this.venobo.mainWindow.emit(EXTERNAL_PLAYER_NOT_FOUND);

            return this.spawnExternal([
                '--play-and-exit',
                '--video-on-top',
                '--quiet',
                `--meta-title=${JSON.stringify(title)}`
            ], vlcPath);
        });
    }

    public kill() {
        if (!this.proc) return;

        this.proc.kill('SIGKILL');
        this.proc = null;
    }

    private spawnExternal(args: string[], playerPath: string = this.playerPath) {
        if (process.platform === 'darwin' && path.extname(playerPath) === '.app') {
            // Mac: Use executable in packaged .app bundle
            playerPath += '/Contents/MacOS/' + path.basename(playerPath, '.app');
        }

        this.proc = spawn(playerPath, args, { stdio: 'ignore' });

        // If it works, close the modal after a second
        const closeModal = this.closeModalTimeout();

        this.proc.on('close', (code) => {
            clearTimeout(closeModal);
            if (!this.proc) return;
            this.proc = null;

            return code === 0
                ? this.venobo.mainWindow.emit('backToList')
                : this.venobo.mainWindow.emit(EXTERNAL_PLAYER_NOT_FOUND);
        });
    }

    private closeModalTimeout() {
        return setTimeout(() => {
            this.venobo.mainWindow.emit('exitModal');
        }, 1000);
    }

}
