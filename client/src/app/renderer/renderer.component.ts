import { Component, ComponentFactoryResolver,
         ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { ContainerService } from '@renderer/services/container.service';
import { ApiClientSerivce } from '@renderer/services/api-client.service';
import { Element } from '@element/models/element';
import { HTMLTags } from '@element/models/htmltags';
import { SpawnPosition } from '@element/models/spawn-positions';
import { ElementComponent } from '@element/element.component';
import { SnackBarService } from '@services/snack-bar.service';

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

  public elementCreate(tag: string) {
    this.api.postElement(tag).subscribe(
      (resp: string[]) => {
        var elemId = '';

        for (const val in resp)
          if (val === 'id')
            elemId = resp[val];

        this.createElement(<HTMLTags>tag, elemId);
        this.snack.open("Saved!");
      },
      () => {
        console.error("Cannot create element");
      });
  }

  public elementUpdate(element: Element) {
    this.api.postElementById(element).subscribe({
      complete: () => {
        this.snack.open("Saved!");
      },
      error: () => {
        this.snack.open("Server error!");
        console.warn("Server error!");
      }
    });
  }

  public elementUpdatePosition(element: Element) {
    this.detachEelemet(element);
    element.component.instance.reset();
    if (this.attachToContainer(element))
      return true;
    else
      throw new Error("Container insert error. Can't find right container...");
  }

  private getElements() {
    this.api.getElements().subscribe(resp =>
      resp.forEach(element => {
        if (element.cords === null)
          element.cords = { x: 0, y: 0 };

        this.createElement(element.tag,
          element.id,
          element.content,
          element.position,
          element.cords,
          element.color);
      }));
  }

  constructor(
    private container: ContainerService,
    private api: ApiClientSerivce,
    private snack: SnackBarService,
    private ngFactory: ComponentFactoryResolver,
    private ngContainer: ViewContainerRef,
  ) { }

  ngOnInit() {
    this.getElements();
  }

  private detachEelemet(element: Element) {
    const hostView = element.component.hostView;

    if (this.center.indexOf(hostView) != -1)
      this.center.detach(this.center.indexOf(hostView));
    else if(this.top.indexOf(hostView) != -1)
      this.top.detach(this.top.indexOf(hostView));
    else if (this.left.indexOf(hostView) != -1)
      this.left.detach(this.left.indexOf(hostView));
    else if (this.right.indexOf(hostView) != -1)
      this.right.detach(this.right.indexOf(hostView));
    else if (this.bottom.indexOf(hostView) != -1)
      this.bottom.detach(this.bottom.indexOf(hostView));
    else
      throw new Error("Container detach error. Can't find right container...");
  }

  //https://indepth.dev/posts/1054/here-is-what-you-need-to-know-about-dynamic-components-in-angular
  private createElement(
    tag: HTMLTags,
    id: string = '',
    content: string = "Initial",
    grid: SpawnPosition = SpawnPosition.center,
    cords: { x: number, y: number } = { x: 0, y: 0 },
    color: string = '#000000'
  ) : Element {
    const componentType = this.ngFactory.resolveComponentFactory(ElementComponent);
    const component = this.ngContainer.createComponent(componentType);

    component.instance.id = id;
    component.instance.tag = tag;
    component.instance.position = grid;
    component.instance.component = component;
    component.instance.content = content;
    component.instance.cords = cords;
    component.instance.color = color;

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
