// Enough Handson - RxJS
// Part 6

console.log('----------RxJS: Transform Operators : merge & concat (with supersets)-------------');


console.log('** merge on string **');

let merged$ = Rx.Observable.of('Stream 1...')
                              .merge( Rx.Observable.of('Stream 2...'));

merged$.subscribe((data)=> console.log(data));

console.log('** merge arrays **');

let array1 = [1,2,3];
let array2 = [4,5,6,7,8];

merged$ = Rx.Observable.of(array1).merge(array2);

merged$.subscribe((data)=> console.log(data));

console.log('** merge range **');

Rx.Observable.range(1,5)
  .merge(Rx.Observable.range(1,5))
  .subscribe((data)=> console.log(data));


console.log('** merge interval ( with better syntax for merge operator ) **');

let source1$ = Rx.Observable.interval(3000).map((d)=> 'Source 1: ' + d);
let source2$ = Rx.Observable.interval(500).map((d)=> 'Source 2: ' + d);

Rx.Observable.merge(source1$, source2$)
  .subscribe((d)=> console.log(d));



console.log('** concat respects delayed streams **');

const sourceOne = Rx.Observable.of(1,2,3).delay(3000);
const sourceTwo = Rx.Observable.of(4,5,6);

//sourceTwo waits on sourceOne to complete before subscribing
const example1 = sourceOne.concat(sourceTwo);
//output: 1,2,3,4,5,6
example1.subscribe(val => console.log('Delayed source one:', val));


console.log('** merge does not respects delayed streams **');

const example2 = sourceOne.merge(sourceTwo);
//output: 4,5,6,1,2,3
example2.subscribe(val => console.log('Non Delayed Source one:', val));

console.log('** concat : second stream waits for first to complete ( and may never run) **');
//when source never completes, the subsequent observables never runs
const source = Rx.Observable
  .concat(
    Rx.Observable.interval(1000),
    Rx.Observable.of('Will','I','Ever','Run','?'),
  );
//outputs: 1,2,3,4....
const subscribe = source.subscribe(val => console.log('Source never completes, second observable never runs:', val));

// In the above example, change the order of observable or use merge to make sure both run


console.log('** concatAll and mergeAll  **');
// P.S: This example is seamlessly copied from Brian Troncone's amazing book learn-rxjs

const obs1 = Rx.Observable.interval(1000).take(5);
const obs2 = Rx.Observable.interval(500).take(2);
const obs3 = Rx.Observable.interval(2000).take(1);
//emit three observables
const allSource$ = Rx.Observable.of(obs1, obs2, obs3);
//subscribe to each inner observable in order when previous completes

/*
 Subscribes to each inner observable and emit values, when complete subscribe to next
 obs1: 0,1,2,3,4 (complete) > move to next if any
 obs2: 0,1 (complete) > move to next if any
 obs3: 0 (complete) > move to next if any > no more streams > done
 */

allSource$.concatAll().subscribe(val => console.log(val));


/*
 Same example but now lets looks at a mergeAll variation of it:


 Subscribes to each inner observable and emit values concurrently

    ..........obs1(0)..........obs1(1)..........obs1(2)..........obs1(3)..........obs1(4)..........X
    .....obs2(0).....obs2(1)
    ....................obs3(0)....................x

 M:.....2(0).....1(0).....2(1).....3(0)1(1)..........1(2)..........1(3)..........1(4)..........X


 */

allSource$.mergeAll().subscribe(val => console.log(val));