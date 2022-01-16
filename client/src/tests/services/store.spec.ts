import { TestBed } from "@angular/core/testing";
import { AppModule } from "src/app/app.module";
import { WebSocketModule } from "@websocket/websocket.module";
import { StoreService } from "@services/store.service";
import { Element } from "@renderer/models/element";
import { makeElement } from "@renderer/models/element.utils";

describe('StoreService', () => {
  let storeService: StoreService;
  let element: Element = makeElement();

  function containElement(element: Element) {
    expect(storeService['_elements$'].getValue())
      .toContain(jasmine.objectContaining(element));
  }

  function notContainElement(element: Element) {
    expect(storeService['_elements$'].getValue())
      .not.toContain(jasmine.objectContaining(element));
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        WebSocketModule.configure({
          url: 'wss://0.0.0.0:10000'
        })
      ],
      providers: [StoreService]
    }).compileComponents();

    storeService = TestBed.inject(StoreService);
  });

  describe('elements$ behavior', () => {

    it('should be empty', () => {
      storeService.fetch().subscribe();

      storeService.elements$
        .subscribe(element => {
          expect(element).toEqual([]);
        });
    });

    it('should add one element', () => {
      storeService.create(element).subscribe();

      containElement(element);
    });

    it('should remove element and be empty', () => {
      storeService.remove(element).subscribe();

      expect(storeService['_elements$'].value).toEqual([]);
    });

  });

  describe('CRUD operations', () => {
    let element = makeElement();

    it('should add element', () => {
      storeService.create(element).subscribe();

      containElement(element);
    });

    it('should update element', () => {
      const elem: Element = { ...element, content: 'test' };

      storeService.update(elem).subscribe();

      containElement(elem);
      notContainElement(element);
    });


    it('should remove element', () => {
      storeService.remove(element).subscribe();

      notContainElement(element);
    });

  });
});
