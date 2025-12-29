import {
  Scene,
  WebGLRenderer
} from 'three';
import { GameScene } from './view/GameScene';
import { GameRenderer } from './view/GameRenderer';
import { GameDirector } from './controller/GameDirector';
import { container } from 'tsyringe';

export class Main {
  private scene!: GameScene;
  private renderer!: GameRenderer;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      console.error('Container element not found!');
      return;
    }

    // this.scene = new GameScene();
    container.registerSingleton(GameScene);
    container.registerSingleton(GameRenderer);
    this.renderer = container.resolve(GameRenderer);
    // this.renderer = container.registerSingleton(WebGLRenderer);

    this.container.appendChild(this.renderer.domElement);
    new GameDirector();
  }
}