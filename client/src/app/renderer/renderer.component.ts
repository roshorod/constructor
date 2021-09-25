import { AfterViewInit, Component,
         ComponentFactoryResolver,
         ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../element/element.component';
import { HTMLTags } from '../models/htmltags';
import { SpawnPosition } from '../models/settings';
import { Element } from '../models/element';
import { ContainerService } from '../services/container.service';
import { ApiClientSerivce } from '../services/api-client.service';


@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements AfterViewInit {

  @ViewChild('topTempl', { read: ViewContainerRef })
  private top: ViewContainerRef;

  @ViewChild('leftTempl', { read: ViewContainerRef })
  private left: ViewContainerRef;

  @ViewChild('centerTempl', { read: ViewContainerRef })
  private center: ViewContainerRef;

  @ViewChild('rightTempl', { read: ViewContainerRef })
  private right: ViewContainerRef;

  @ViewChild('bottomTempl', { read: ViewContainerRef })
  private bottom: ViewContainerRef;

  constructor(
    public container: ContainerService,
    public api: ApiClientSerivce,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef,
  ) { }

  ngAfterViewInit() {
    this.getElement();
    // this.createElement('h1' as HTMLTags, SpawnPosition.top);
    // this.createElement('h1' as HTMLTags, SpawnPosition.bottom);
  }

  private getElement() {
    this.api.getElement()
      .subscribe(resp =>
        this.createElement(resp['tag'], resp['content'], resp['position'])
      );
  }

  private detachEelemet(element: Element) {
    const hostView = element.component.hostView;

    const top = this.top as ViewContainerRef;
    const left = this.left as ViewContainerRef;
    const center = this.center as ViewContainerRef;
    const right = this.right as ViewContainerRef;
    const bottom = this.bottom as ViewContainerRef;

    if (center.indexOf(hostView) != -1) {
      center.detach(center.indexOf(hostView));
    }
    else if(top.indexOf(hostView) != -1) {
      top.detach(top.indexOf(hostView));
    }
    else if (left.indexOf(hostView) != -1) {
      left.detach(left.indexOf(hostView));
    }
    else if (right.indexOf(hostView) != -1) {
      right.detach(right.indexOf(hostView));
    }
    else if (bottom.indexOf(hostView) != -1) {
      bottom.detach(bottom.indexOf(hostView));
    } else {
      throw new Error("Container detach error. Can't find right container...");
    }
  }

  updateElementPosition(element: Element) {
    this.detachEelemet(element);

    element.component.instance.reset();

    switch (element.component.instance.position) {
      case SpawnPosition.top: {
        const containerView = this.top as ViewContainerRef;
        containerView.insert(element.component.hostView);
        break;
      }
      case SpawnPosition.left: {
        const containerView = this.left as ViewContainerRef;
        containerView.insert(element.component.hostView);
        break;
      }
      case SpawnPosition.center: {
        const containerView = this.center as ViewContainerRef;
        containerView.insert(element.component.hostView);
        break;
      }
      case SpawnPosition.right: {
        const containerView = this.right as ViewContainerRef;
        containerView.insert(element.component.hostView);
        break;
      }
      case SpawnPosition.bottom: {
        const containerView = this.bottom as ViewContainerRef;
        containerView.insert(element.component.hostView);
        break;
      }
      default: {
        throw new Error("Container insert error. Can't find right container...");
      }
    }
  }

  createElement(
    tag: HTMLTags,
    content: string = "Initial",
    grid: SpawnPosition = SpawnPosition.center) : Element {

    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(componentType);
    component.instance.tag = tag;
    component.instance.position = grid;
    component.instance.component = component;
    component.instance.content = content;

    if (tag == HTMLTags.h1)
      component.instance.child
        .push(this.createElement('i' as HTMLTags, SpawnPosition.bottom))

    if (tag == HTMLTags.i)
      component.instance.child
        .push(this.createElement('b' as HTMLTags, SpawnPosition.right))

    switch(component.instance.position){
      case SpawnPosition.top: {
        const containerView = this.top as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elements.insert(component.instance);
        break;
      }
      case SpawnPosition.left: {
        const containerView = this.left as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elements.insert(component.instance);
        break;
      }
      case SpawnPosition.center: {
        const containerView = this.center as ViewContainerRef;
        containerView.insert(component.hostView);
        this.container.elements.insert(component.instance);
        break;
      }
      case SpawnPosition.right: {
        const containerView = this.right as ViewContainerRef;
        containerView.insert(component.hostView);

        if (tag != HTMLTags.b) {
          this.container.elements.insert(component.instance);
        }
        break;
      }
      case SpawnPosition.bottom: {
        const containerView = this.bottom as ViewContainerRef;
        containerView.insert(component.hostView);

        if (tag != HTMLTags.i)
        {
          this.container.elements.insert(component.instance);
        }
        break;
      }
      default: {
        component.destroy();
      }
    }

    return component.instance;
  }
}
