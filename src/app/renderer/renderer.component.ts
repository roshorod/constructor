import { Component, ComponentFactoryResolver,
         ViewChild, ViewContainerRef} from '@angular/core';

import { ElementComponent } from '../element/element.component';
import { HTMLTags } from '../models/HTMLTags';
import { BuilderService } from '../services/builder.service';

@Component({
  selector: 'app-renderer',
  template: '<ng-template id="template" elements></ng-template>',
})
export class RendererComponent {

  @ViewChild('elements', {read: ViewContainerRef})
  private elements: ViewContainerRef | undefined;

  constructor(
    private builder: BuilderService,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef
  ) { }

  createElement(tag: HTMLTags) {
    const T = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(T);

    component.instance.tag = tag;

    this.builder.container.addItem(component);
  }
}
