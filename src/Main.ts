import {
  Scene,
  WebGLRenderer
} from 'three';
import { GameScene } from './view/GameScene';
import { GameRenderer } from './view/GameRenderer';
import { GameDirector } from './controller/GameDirector';

export class Main {
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      console.error('Container element not found!');
      return;
    }

    this.scene = new GameScene();
    this.renderer = new GameRenderer();
    this.container.appendChild(this.renderer.domElement);
    new GameDirector(this.scene, this.renderer);
  }
}