import { Component, ComponentFactoryResolver,
         ViewChild, ViewContainerRef, OnInit } from '@angular/core';
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
export class RendererComponent implements OnInit {

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

  private getElements() {
    this.api.getElements().subscribe(resp =>
      resp.forEach(element => {
        if (element.cords === null)
          element.cords = { x: 0, y: 0 };

        this.createElement(element.tag,
          element.id,
          element.content,
          element.position,
          element.cords);
      }));
  }

  ngOnInit() {
    this.getElements();
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

  public updateElementPosition(element: Element) {
    this.detachEelemet(element);

    element.component.instance.reset();

    if (this.attachToContainer(element))
      return true;
    else
      throw new Error("Container insert error. Can't find right container...");
  }

  //https://indepth.dev/posts/1054/here-is-what-you-need-to-know-about-dynamic-components-in-angular
  public createElement(
    tag: HTMLTags,
    id: string = '',
    content: string = "Initial",
    grid: SpawnPosition = SpawnPosition.center,
    cords: { x: number, y: number } = { x: 0, y: 0 }
  ) : Element {
    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(componentType);

    component.instance.id = id;
    component.instance.tag = tag;
    component.instance.position = grid;
    component.instance.component = component;
    component.instance.content = content;
    component.instance.cords = cords;

    if (this.attachToContainer(component.instance))
      this.container.elements.insert(component.instance);
    else
      component.destroy();

    return component.instance;
  }

  private attachToContainer(component: Element): boolean{
    const hostView = component.component.hostView;

    switch (component.position) {
      case SpawnPosition.top: {
        this.top.insert(hostView);
        break;
      }
      case SpawnPosition.left: {
        this.left.insert(hostView);
        break;
      }
      case SpawnPosition.center: {
        this.center.insert(hostView);
        break;
      }
      case SpawnPosition.right: {
        this.right.insert(hostView);
        break;
      }
      case SpawnPosition.bottom: {
        this.bottom.insert(hostView);
        break;
      }
      default:
        return false;
    }
    return true;
  }
}
