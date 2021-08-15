import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ComponentFactoryResolver,
         OnInit,
         ViewChild, ViewContainerRef} from '@angular/core';

import { ElementComponent } from '../element/element.component';
import { HTMLTags } from '../models/htmltags';
import { SpawnPosition } from '../models/settings';
import { ContainerService } from '../services/container.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements AfterViewInit {

  @ViewChild('topTempl', { read: ViewContainerRef })
  private top: ViewContainerRef | undefined;

  @ViewChild('leftTempl', { read: ViewContainerRef })
  private left: ViewContainerRef | undefined;

  @ViewChild('centerTempl', { read: ViewContainerRef })
  private center: ViewContainerRef | undefined;

  @ViewChild('rightTempl', { read: ViewContainerRef })
  private right: ViewContainerRef | undefined;

  @ViewChild('bottomTempl', { read: ViewContainerRef })
  private bottom: ViewContainerRef | undefined;

  constructor(
    public container: ContainerService,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef
  ) { }

  ngAfterViewInit() {
    this.createElement('h1' as HTMLTags, SpawnPosition.top);
    this.createElement('h1' as HTMLTags, SpawnPosition.bottom);
  }

  createElement(tag: HTMLTags, grid?: SpawnPosition) {
    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(componentType);
    component.instance.tag = tag;

    if(grid)
      component.instance.grid = grid;

    switch(component.instance.grid){
      case SpawnPosition.top: {
        const containerView = this.top as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elementContainer.insert(component);
        break;
      }
      case SpawnPosition.left: {
        const containerView = this.left as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elementContainer.insert(component);
        break;
      }
      case SpawnPosition.center: {
        const containerView = this.center as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elementContainer.insert(component);
        break;
      }
      case SpawnPosition.right: {
        const containerView = this.right as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elementContainer.insert(component);
        break;
      }
      case SpawnPosition.bottom: {
        const containerView = this.bottom as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elementContainer.insert(component);
        break;
      }
      default: {
        component.destroy();
      }
    }
  }
}
