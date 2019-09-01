import { Observable, Subject, Subscription } from 'rxjs';

export type Action<TAccess, TService> = {
    readonly [P in Exclude<keyof TService, 'subscriptions' | 'results'>]: TAccess
};

export abstract class ActionsService<TService, TSubscription = Subscription> {
    public readonly subscriptions: Action<Observable<TSubscription>, TService>;
    public readonly results: Action<Observable<any>, TService>;

    protected readonly _results: Action<Subject<any>, TService>;
    protected readonly _subscriptions: Action<Subject<TSubscription>, TService>;

    protected constructor() {
        this._subscriptions = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter((name) => name !== 'constructor')
            .reduce(
                (actions, name) => {
                    actions[name] = new Subject();
                    return actions;
                },
                {} as Action<Subject<TSubscription>, TService>);

        this.subscriptions = {
            ...Object.entries(this._subscriptions)
                .reduce(
                    (actions, [ key, subject ]: [ string, Subject<TSubscription> ]) => {
                        actions[key] = subject.asObservable();
                        return actions;
                    },
                    {} as Action<Observable<TSubscription>, TService>)
        };

        this._results = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter((name) => name !== 'constructor')
            .reduce(
                (actions, name) => {
                    actions[name] = new Subject();
                    return actions;
                },
                {} as Action<Subject<any>, TService>);

        this.results = {
            ...Object.entries(this._results)
                .reduce(
                    (actions, [ key, subject ]: [ string, Subject<any> ]) => {
                        actions[key] = subject.asObservable();
                        return actions;
                    },
                    {} as Action<Observable<TSubscription>, TService>)
        };
    }
}
