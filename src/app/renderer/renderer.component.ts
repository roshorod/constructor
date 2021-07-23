import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ComponentFactoryResolver,
         OnInit,
         ViewChild, ViewContainerRef} from '@angular/core';

import { ElementComponent } from '../element/element.component';
import { HTMLTags } from '../models/htmltags';
import { ContainerService } from '../services/container.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements AfterViewInit {

  @ViewChild('elements', {read: ViewContainerRef})
  private elements: ViewContainerRef | undefined;

  constructor(
    private container: ContainerService,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef
  ) { }

  ngAfterViewInit() {
    // this.createElement('h1' as HTMLTags);
  }

  createElement(tag: HTMLTags) {
    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(componentType);
    component.instance.tag = tag;

    if(this.elements)
    {
      this.elements.insert(component.hostView);
      this.container.elementContainer.insert(component);
    } else {
      component.destroy();
    }
  }
}
