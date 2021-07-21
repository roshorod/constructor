import { Component, ComponentFactoryResolver,
         ViewChild, ViewContainerRef} from '@angular/core';

import { ElementComponent } from '../element/element.component';
import { HTMLTags } from '../models/HTMLTags';
import { ContainerService } from '../services/container.service';

@Component({
  selector: 'app-renderer',
  template: '<ng-template></ng-template>',
})
export class RendererComponent {

  @ViewChild('elements', {read: ViewContainerRef})
  private elements: ViewContainerRef | undefined;

  constructor(
    private container: ContainerService,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef
  ) { }

  createElement(tag: HTMLTags) {
    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);

    const component = this.ngContainer.createComponent(componentType);
    component.instance.tag = tag;

    this.container.elementContainer.insert(component);
  }
}
