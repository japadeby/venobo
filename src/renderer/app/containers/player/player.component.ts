import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  protected videoStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: '0',
    top: '0px',
  };

  protected videoPlayerStyle = {
    backgroundColor: 'rgb(0,0,0)',
    position: 'relative',
    height: 'inherit',
    width: 'inherit',
  };

  protected isLoading: boolean = true;

  protected isPaused: boolean = false;

  private videoSeekerInterval: number;

  private duration!: number;

  constructor(protected location: Location) {}

  private videoCurrentTime() {

  }

  protected toggleFullScreen() {}

  protected handleVolumeWheel() {}

  protected mediaMouseMoved() {}

  protected isDisabledStyle(classNames: string) {
    return [classNames, {
      disabled: !this.isLoading,
    }];
  }

  protected playPause() {}

  /**
   * Solution to remove the ghost image when dragging
   * @author <https://stackoverflow.com/a/19601254/7933677>
   */
  private setFakeDragIcon(dt: DataTransfer) {
    const dragIcon = document.createElement('img');
    // dragIcon.src = ''; // "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAAL‌​AAAAAABAAEAAAIBRAA7"

    dt.setDragImage(dragIcon, -99999, -99999);
    dt.effectAllowed = 'none';
  }

  protected handleDragStart(event: DragEvent) {
    // Prevent the cursor from changing, eg to a green + icon on Mac
    // And prevent a ghost image of the handle to appear
    const dt = event.dataTransfer;
    if (dt) this.setFakeDragIcon(dt);
  }

  private scrubbingLabel(seconds: number) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  private videoSeeker() {

  }

  ngOnInit() {
    const mediaTag = this.videoPlayer.nativeElement;

    mediaTag.addEventListener('durationchange', () => {
      console.log('Video duration: ' + mediaTag.duration);
      this.duration = mediaTag.duration;
    });

    // If media has already been played, start from where we left off

    this.videoSeekerInterval = setInterval(this.videoSeeker, 1000);
  }

}
