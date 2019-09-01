import { OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { Unsubscribable } from './unsubscribable';

export abstract class ContentService<T, L = Subscription> extends Unsubscribable implements OnDestroy {
    protected readonly _content: ReplaySubject<T>;
    protected readonly _refresh: ReplaySubject<void>;
    protected readonly _load: ReplaySubject<L>;

    public content: Observable<T>;
    public load: Observable<L>;

    protected constructor() {
        super();
        this._refresh = new ReplaySubject(1);
        this._content = new ReplaySubject(1);
        this._load = new ReplaySubject(1);

        this.content = this._content.asObservable();
        this.load = this._load.asObservable();

        this._refresh.next();
    }
}
