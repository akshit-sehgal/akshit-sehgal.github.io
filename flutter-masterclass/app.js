'use strict';

// Flutter Fieldguide: self-contained, offline-readable course UI. No runtime framework required.
const SECTIONS = [
  {id:'overview', title:'Course overview', short:'Start here', minutes:3},
  {id:'mental-model', title:'The Flutter mental model', short:'Flutter vs React', minutes:9},
  {id:'widget-tree', title:'Widget trees & rendering', short:'Widget / Element / RenderObject', minutes:14},
  {id:'dart', title:'Dart for React developers', short:'Syntax & null safety', minutes:13},
  {id:'layout', title:'Layouts & constraints', short:'Row, Column, Expanded', minutes:18},
  {id:'state', title:'State & lifecycle', short:'setState in practice', minutes:17},
  {id:'project', title:'Build Habit Lab', short:'Complete Flutter app', minutes:22},
  {id:'production', title:'Production performance', short:'Rebuilds, memory & jank', minutes:17},
  {id:'testing', title:'Testing & accessibility', short:'Unit and widget tests', minutes:13},
  {id:'libraries', title:'Essential libraries', short:'Production toolbelt', minutes:11},
  {id:'exercises', title:'Exercises & knowledge check', short:'Prove what you learned', minutes:15},
  {id:'roadmap', title:'Full course roadmap', short:'What comes next', minutes:4},
];
const TRACKED = SECTIONS.filter(s=>s.id!=='overview' && s.id!=='roadmap');
const MODULES = [
 ['Flutter foundations','Widget trees, layouts, local state, constraints','Habit Lab','Available now'],
 ['Modern Dart','Generics, records, patterns, Futures, Streams, isolates','Dart utility toolkit','Planned'],
 ['Advanced UI layouts','Adaptive screens, Slivers, scrolling & large screens','Responsive dashboard','Planned'],
 ['Forms & lifecycle','Forms, validation, controllers, persistence, keys','Editable habit tracker','Planned'],
 ['Application architecture','Riverpod, BLoC comparison, repositories, dependency injection','Multi-feature app','Planned'],
 ['Navigation & deep links','go_router, nested routes, web URLs, state restoration','Routed application','Planned'],
 ['Networking & async','Dio, JSON, pagination, retry, cancellation, caching','API-powered dashboard','Planned'],
 ['Backends & offline-first','Supabase, authentication, Drift, synchronization','Offline-capable app','Planned'],
 ['Polished experiences','Animations, theming, accessibility, localization','Product-quality UI','Planned'],
 ['Platform integration','Files, camera, permissions, notifications & platform channels','Native integrations','Planned'],
 ['Performance & profiling','DevTools, frame analysis, images, isolates, startup','Performance audit','Planned'],
 ['Shipping & operations','Testing strategy, security, flavors, CI/CD, observability','Release-ready app','Planned'],
];
const HABITS = ['Read 20 minutes','Practice Flutter','Walk 30 minutes'];
const EXERCISES = [
 {title:'Add a fourth habit',detail:'Add “Drink water” and verify the progress denominator and list update.',hint:'Change the _habits constant in _HabitDashboardState. Notice that progress is derived from _habits.length.'},
 {title:'Show a completion message',detail:'Make your congratulatory message appear only when all habits are done.',hint:'Inside Column children, use if (doneCount == _habits.length) followed by a Text widget.'},
 {title:'Style completed habit titles',detail:'Strike through the title when a habit is completed.',hint:'In HabitRow, use Text(title, style: TextStyle(decoration: isDone ? TextDecoration.lineThrough : null)).'},
 {title:'Implement Undo',detail:'Let users reverse the last completion action using a SnackBar.',hint:'Keep the changed habit ID. Show a SnackBar with an action whose callback invokes _toggleHabit for that ID.'},
 {title:'Add a Reset widget test',detail:'Verify Reset returns the progress to zero.',hint:'Use tester.tap(find.text("Reset progress")); await tester.pump(); then assert find.text("0 of 3 completed").'},
];
const MCQS = [
 {q:'Why is ListView.builder usually better for thousands of items?',opts:['It downloads remote data automatically','It constructs children lazily as needed','It guarantees there are no rebuilds'],correct:1,why:'It lazily creates list item widgets. It does not perform API pagination or prevent all rebuilds.'},
 {q:'When setState() is called, what is guaranteed?',opts:['The entire screen immediately repaints','The framework marks the relevant element as needing rebuild','All child states are destroyed'],correct:1,why:'Flutter schedules a build. Elements and render objects can be reused, and paint may be skipped.'},
 {q:'What happens if a child asks for width 300 under tight width 200 constraints?',opts:['The child chooses 300','The child must obey 200','Flutter automatically scrolls horizontally'],correct:1,why:'Constraints from parents bound child sizing. Scrollability requires an appropriate scrollable widget.'},
];
const TREE = [
 {id:'MaterialApp',indent:0,description:'Application root for Material features including app-wide theme, locale and top-level routing.',tag:'Application shell',details:'MaterialApp provides Navigator-related infrastructure, Theme data and localizations. It is not a visual page by itself.'},
 {id:'Scaffold',indent:1,description:'Establishes the structure of a Material screen: app bar, body, drawer, bottom navigation and floating action button.',tag:'Screen layout',details:'The Scaffold is a convenience widget; build multiple screens with their own Scaffold where useful.'},
 {id:'AppBar',indent:2,description:'Header / app bar area attached to the Scaffold appBar slot.',tag:'Screen chrome',details:'Controls toolbar actions, title, automatically implied leading/back controls and flexible heights.'},
 {id:'Column',indent:2,description:'Positions children vertically using flex layout.',tag:'Layout widget',details:'Column children are unconstrained in the main axis by default. Expanded works only when the Column has bounded main-axis space.'},
 {id:'Text',indent:3,description:'Displays a string and supports rich typography, overflow and semantics.',tag:'Leaf widget',details:'Text uses inherited text styling and supports overflow handling such as ellipsis. Set maxLines when limiting content.'},
 {id:'Card',indent:3,description:'Groups related content on a Material surface.',tag:'Composite widget',details:'Internally builds other widgets; its widget subtree will be more detailed than this simplified source-level view.'},
 {id:'FilledButton',indent:3,description:'A Material button handling interaction and disabled state.',tag:'Interactive widget',details:'Pass a function to onPressed. When null, Flutter renders its disabled appearance and prevents interaction.'}
];
const DART_HELLO = `import 'package:flutter/material.dart';

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello Flutter!'),
        ),
      ),
    ),
  );
}`;
const DART_WIDGET = `class Greeting extends StatelessWidget {
  const Greeting({
    super.key,
    required this.name,
    this.age = 18,
  });

  final String name;
  final int age;

  @override
  Widget build(BuildContext context) {
    return Text('Hello $name, age $age');
  }
}

// Call sites use named parameters:
const Greeting(name: 'Alex', age: 25);`;
const DART_NULL = `String? nickname; // may be null
final label = nickname ?? 'Guest';

String greet(String name) => 'Hello $name';

Future<String> fetchGreeting() async {
  await Future.delayed(const Duration(milliseconds: 500));
  return greet('Flutter developer');
}

// final: assigned once; const: compile-time constant
final startedAt = DateTime.now();
const attempts = 3;`;
const DART_LAYOUT = `Row(
  children: [
    const Icon(Icons.home),
    const SizedBox(width: 12),
    const Expanded(
      child: Text(
        'Long description with the remaining space',
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    ),
    IconButton(
      onPressed: () {},
      icon: const Icon(Icons.settings),
    ),
  ],
)`;
const DART_STATE = `class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Text('Count: $count'),
      FilledButton(
        onPressed: () => setState(() => count++),
        child: const Text('Increment'),
      ),
    ],
  );
}`;
const DART_LIFECYCLE = `class _ProfileState extends State<Profile> {
  late final TextEditingController controller;

  @override
  void initState() {
    super.initState();
    controller = TextEditingController();
  }

  Future<void> save() async {
    await repository.save(controller.text);
    if (!mounted) return; // or context.mounted
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Saved')),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}`;
const DART_FULL = `import 'package:flutter/material.dart';

void main() {
  runApp(const HabitLabApp());
}

class HabitLabApp extends StatelessWidget {
  const HabitLabApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Habit Lab',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.indigo,
        ),
      ),
      home: const HabitDashboard(),
    );
  }
}

class HabitDashboard extends StatefulWidget {
  const HabitDashboard({super.key});

  @override
  State<HabitDashboard> createState() =>
      _HabitDashboardState();
}

class _HabitDashboardState
    extends State<HabitDashboard> {
  static const _habits = <String>[
    'Read 20 minutes',
    'Practice Flutter',
    'Walk 30 minutes',
  ];

  final Set<String> _completed = {};

  void _toggleHabit(String habit) {
    setState(() {
      if (_completed.contains(habit)) {
        _completed.remove(habit);
      } else {
        _completed.add(habit);
      }
    });
  }

  void _reset() {
    setState(() => _completed.clear());
  }

  @override
  Widget build(BuildContext context) {
    final doneCount = _completed.length;
    final progress = doneCount / _habits.length;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Habit Lab')),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 680),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Today',
                      style: theme.textTheme.headlineMedium),
                  const SizedBox(height: 8),
                  Text('$doneCount of \${_habits.length} completed'),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                  ),
                  const SizedBox(height: 24),
                  Text('Your habits',
                      style: theme.textTheme.titleLarge),
                  const SizedBox(height: 12),
                  Expanded(
                    child: ListView.builder(
                      itemCount: _habits.length,
                      itemBuilder: (context, index) {
                        final habit = _habits[index];
                        return HabitRow(
                          key: ValueKey(habit),
                          title: habit,
                          isDone: _completed.contains(habit),
                          onToggle: () => _toggleHabit(habit),
                        );
                      },
                    ),
                  ),
                  if (doneCount == _habits.length)
                    const Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('All habits completed!',
                          textAlign: TextAlign.center),
                    ),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: _completed.isEmpty ? null : _reset,
                    child: const Text('Reset progress'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HabitRow extends StatelessWidget {
  const HabitRow({
    super.key,
    required this.title,
    required this.isDone,
    required this.onToggle,
  });

  final String title;
  final bool isDone;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: CheckboxListTile(
        value: isDone,
        title: Text(title),
        subtitle: Text(
          isDone ? 'Completed' : 'Not yet completed',
        ),
        controlAffinity: ListTileControlAffinity.leading,
        onChanged: (_) => onToggle(),
      ),
    );
  }
}`.replace('\${_habits.length}', '\u0024{_habits.length}');
const DART_TEST = `import 'package:flutter_test/flutter_test.dart';
import 'package:habit_lab/main.dart';

void main() {
  testWidgets('completing a habit updates progress',
      (tester) async {
    await tester.pumpWidget(const HabitLabApp());

    expect(find.text('0 of 3 completed'), findsOneWidget);

    await tester.tap(find.text('Read 20 minutes'));
    await tester.pump();

    expect(find.text('1 of 3 completed'), findsOneWidget);
  });
}`;
const DART_RESET_TEST = `testWidgets('reset clears completed habits',
    (tester) async {
  await tester.pumpWidget(const HabitLabApp());
  await tester.tap(find.text('Read 20 minutes'));
  await tester.pump();

  await tester.tap(find.text('Reset progress'));
  await tester.pump();
  expect(find.text('0 of 3 completed'), findsOneWidget);
});`;
const DART_PERF = `// Move stateful work into the narrowest responsible widget.
// Prefer lazily-created children for long scrolling lists.
ListView.builder(
  itemCount: products.length,
  itemBuilder: (context, index) => ProductTile(
    key: ValueKey(products[index].id),
    product: products[index],
  ),
)

// Use 'const' where the constructor and arguments permit it.
const SizedBox(height: 16);
const Icon(Icons.check_circle);`;
const BASH_SETUP = `flutter doctor -v
flutter create habit_lab
cd habit_lab
flutter run -d chrome`;
const BASH_CHECKS = `dart format .
flutter analyze
flutter test
flutter run --profile -d <device-id>`;

function safeGet(key,fallback){try{const v=JSON.parse(localStorage.getItem('flutter-fieldguide:'+key));return v??fallback;}catch{return fallback;}}
function safeSet(key,value){try{localStorage.setItem('flutter-fieldguide:'+key,JSON.stringify(value));}catch{}}
const state={completed:safeGet('completed',[]),exercises:safeGet('exercises',[]),quiz:safeGet('quiz',{}),habits:safeGet('habits',[]),theme:safeGet('theme','light'),layout:safeGet('layout',{direction:'row',gap:12,flex:true}),constraints:{parent:260,child:160,loose:true},tree:'Column',active:'overview'};
const $=sel=>document.querySelector(sel);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(id,label)=>`<a href="#/${id}" class="inline-link">${esc(label)}</a>`;
function codeBlock(code,label='main.dart',opts={}) {
 const id='c'+(++codeBlock.counter);
 codeBlock.pool.set(id,code);
 return `<div class="code-shell"><div class="code-toolbar"><div class="code-toolbar-left"><span class="lang-dot"></span><span>${esc(label)}</span></div><div class="code-actions"><button type="button" class="code-action" data-copy="${id}" aria-label="Copy code from ${esc(label)}">Copy code</button>${opts.dartpad?`<button class="code-action" type="button" data-dartpad="${id}">Copy + DartPad ↗</button>`:''}</div></div><pre tabindex="0"><code>${highlight(code)}</code></pre></div>`;
}
codeBlock.counter=0;codeBlock.pool=new Map();
function highlight(code){
 const tokens=/(\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:class|const|final|void|return|extends|implements|required|super|if|else|for|async|await|late|new|true|false|null|var|static|this|override|import|on|setState)\b|\b(?:StatelessWidget|StatefulWidget|State|Widget|BuildContext|MaterialApp|Scaffold|Center|Text|ThemeData|TextStyle|Column|Row|Expanded|Padding|SizedBox|Card|ListView|IconButton|Icon|LinearProgressIndicator|FilledButton|CheckboxListTile|Future|String|Set|List|ColorScheme|ValueKey|BoxConstraints|ConstrainedBox|SafeArea|VoidCallback|TextEditingController|TextDecoration|MainAxisAlignment)\b|\b\d+\b|@override)/g;
 let out='',last=0,match;
 while((match=tokens.exec(code))){out+=esc(code.slice(last,match.index));const t=match[0];const kind=t.startsWith('//')?'comment':t.startsWith("'")||t.startsWith('"')?'string':t.startsWith('@')?'annotation':/^\d/.test(t)?'number':/^[A-Z]/.test(t)?'type':'keyword';out+=`<span class="tok-${kind}">${esc(t)}</span>`;last=tokens.lastIndex;}return out+esc(code.slice(last));
}
const block=(title,body)=>`<section class="lesson-block"><h2>${title}</h2>${body}</section>`;
const note=(content,kind='')=>`<div class="note ${kind}">${content}</div>`;
const para=text=>`<p>${text}</p>`;
const table=(heads,rows)=>`<div class="table-wrap"><table class="compare-table"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const crumb=(title)=>{ $('#breadcrumb').innerHTML=`<span>Flutter Fieldguide</span><span class="crumb-sep">/</span><strong>${esc(title)}</strong>`;};
function hero(title,description,kicker='LESSON 01 · FLUTTER FOUNDATIONS',chips=[]){return `<div class="lesson-hero"><div><span class="kicker">${kicker}</span><h1>${title}</h1><p>${description}</p><div class="hero-chips"><span class="chip accent">Interactive learning</span>${chips.map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div></div><div class="hero-art" aria-hidden="true"><div class="orb"></div><div class="art-panel"><div class="art-header"></div><div class="art-row"><span class="art-dot"></span><span class="art-line purple"></span></div><div class="art-row"><span class="art-dot"></span><span class="art-line"></span></div><div class="art-row"><span class="art-dot"></span><span class="art-line cyan small"></span></div><div class="art-code">Widget build(context) {<br>&nbsp;return Scaffold(...);<br>}</div><span class="art-mini-chip">↗ build()</span></div></div></div>`;}

function overview(){
 return `<section class="overview-hero"><div><span class="kicker">A PRACTICAL INTERACTIVE COURSE</span><h1>Learn Flutter.<br>Understand everything.<br>Ship confidently.</h1><p>Built for JavaScript, React and Node.js developers. From your first widget to the architecture, performance and libraries behind real production apps.</p><div class="hero-chips"><span class="chip">12-module roadmap</span><span class="chip">Interactive diagrams</span><span class="chip">Real Dart code</span></div><div class="action-row"><a class="action-btn" href="#/mental-model">Start lesson 1 →</a><a class="action-btn secondary" style="background:#ffffff20;color:white;border-color:#ffffff35" href="#/roadmap">View curriculum</a></div></div><div class="overview-mark" aria-hidden="true">F</div></section>
 <div class="overview-stats"><div class="overview-stat"><strong>10</strong><span>In-depth lesson chapters</span></div><div class="overview-stat"><strong>4</strong><span>Interactive learning labs</span></div><div class="overview-stat"><strong>12</strong><span>Planned course modules</span></div></div>
 <section class="overview-section"><div class="overview-section-heading"><h2>Learn by doing, not watching</h2><span class="chip accent">Lesson 1 available now</span></div><div class="concept-grid"><div class="concept"><div class="concept-icon">◇</div><strong>Understand visually</strong><p>Widget trees, rendering pipeline, layouts and constraints—with live interactive diagrams.</p></div><div class="concept"><div class="concept-icon">{ }</div><strong>Write working code</strong><p>Copy full Dart examples, open DartPad and build a working Habit Lab application.</p></div><div class="concept"><div class="concept-icon">↗</div><strong>Think production-first</strong><p>Learn real optimization, performance tradeoffs, testing and package choices from the start.</p></div></div></section>
 <section class="overview-section"><div class="overview-section-heading"><h2>Your lesson 1 journey</h2><span class="check-stats" id="overview-progress">${state.completed.filter(x=>TRACKED.some(s=>s.id===x)).length} of ${TRACKED.length} chapters read</span></div><div class="overview-list">${TRACKED.map((s,i)=>`<a class="overview-link" href="#/${s.id}"><span class="lesson-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.short)} · ${s.minutes} min</p></div><span class="arrow">${state.completed.includes(s.id)?'✓':'→'}</span></a>`).join('')}</div></section>
 ${note('<strong>How this course works:</strong> All diagrams run directly in the browser. Copy a Dart example and run it in <a href="https://dartpad.dev/" target="_blank" rel="noopener noreferrer">DartPad</a> or a local Flutter project. Dart execution is external to this site. Reading progress, quiz responses and practice checklists stay in your browser.','green')}`;
}
function mental(){return hero('Think in widgets, not DOM nodes','Transfer your declarative React instincts to Flutter, then understand where the rendering models diverge.',undefined,['Architecture','React comparison'])+`<div class="chapter-content">
 ${block('1. One principle, two rendering systems',`${para('In both React and Flutter, the rendered interface is a function of application state: <strong>UI = f(state)</strong>. Describe the desired output and let the framework update what is necessary. Flutter composes Dart <strong>widgets</strong>, not HTML elements and CSS rules.')}
 <div class="diagram"><div class="diagram-title">From components to pixels</div><div class="arch-pairs"><div class="arch-col"><div class="arch-label">⚛ React (web)</div><div class="arch-step">Components + JSX</div><span class="arch-down">↓</span><div class="arch-step">React reconciliation</div><span class="arch-down">↓</span><div class="arch-step">Browser DOM + CSS</div><span class="arch-down">↓</span><div class="arch-step">Browser painting</div></div><div class="arch-col"><div class="arch-label">◆ Flutter</div><div class="arch-step">Widgets in Dart</div><span class="arch-down">↓</span><div class="arch-step">Element tree</div><span class="arch-down">↓</span><div class="arch-step">RenderObject tree</div><span class="arch-down">↓</span><div class="arch-step">Flutter engine</div></div></div></div>
 ${note('<strong>Important distinction:</strong> Flutter draws its UI with its rendering engine on mobile and desktop. On the web it runs within a browser using Flutter web rendering, rather than building every Flutter widget as an ordinary DOM element. Browser DOM interop is still possible for integrations.')}
 ${table(['React concept','Flutter counterpart','Important nuance'],[
 ['Component','Widget','Widgets are immutable configurations; Elements preserve positions and state.'],
 ['Props','Constructor parameters','Usually named; required can be enforced by Dart.'],
 ['JSX','Dart widget composition','No separate JSX template language.'],
 ['useState','StatefulWidget + setState','For local state; consider Riverpod for shared/async state.'],
 ['Context API','InheritedWidget / provider patterns','BuildContext determines which ancestor values are found.'],
 ['CSS Flexbox','Row, Column, Expanded, Flexible','Constraints and intrinsic sizing rules differ.'],
 ['React Router','go_router','Deep-link and web URL support.']])}`)}
 ${block('2. A runnable first screen',`${para('The entry point is <code>main()</code>. <code>runApp()</code> attaches the root widget, and <code>build()</code> returns a description of the interface. Here is a complete first app:')}${codeBlock(DART_HELLO,'main.dart',{dartpad:true})}<div class="concept-grid"><div class="concept"><div class="concept-icon">①</div><strong>MaterialApp</strong><p>Theme, localization and application-level Material functionality.</p></div><div class="concept"><div class="concept-icon">②</div><strong>Scaffold</strong><p>Familiar screen structure with an app bar, body and navigation slots.</p></div><div class="concept"><div class="concept-icon">③</div><strong>Center → Text</strong><p>Layout parent positions its child, then the text renders its content.</p></div></div>${note('<strong>Try it:</strong> Replace Center with Padding(padding: EdgeInsets.all(32), child: Text(...)). Observe how layout changes without a single line of CSS.','green')}`)}
 ${block('3. Flutter is not a DOM wrapper',`${para('The absence of CSS is not an omission. Flutter gives you strong control over typography, alignment, animation and drawing through composable widgets. This makes many cross-platform screens consistent, but you must deliberately plan web-specific needs such as URL navigation, browser accessibility and text-heavy SEO landing pages.')}${para('Unlike React web, <strong>rebuilding a widget does not equate to rebuilding a browser DOM subtree</strong>. That distinction becomes important in the next chapter.')}`)}
 </div>`;}
function widgetTree(){return hero('Inside the widget tree','Understand what Flutter really rebuilds, what stays mounted, and why BuildContext and stable identity matter.',undefined,['Rendering','Identity','BuildContext'])+`<div class="chapter-content">
 ${block('1. Explore a widget hierarchy',`${para('Click any node to inspect its responsibility. This is a simplified <em>source-level</em> tree for a dashboard; framework widgets may introduce additional descendants.')}
 <div class="widget-explorer"><div class="widget-tree"><div class="mini-heading">INTERACTIVE WIDGET TREE</div>${TREE.map(n=>`<button type="button" class="tree-node ${n.id===state.tree?'active':''}" data-tree="${n.id}" style="padding-left:${11+n.indent*19}px" aria-pressed="${n.id===state.tree}">↳ ${n.id} <small>${esc(n.tag)}</small></button>`).join('')}</div><div class="widget-detail" id="widget-detail" aria-live="polite"></div></div>`)}
 ${block('2. Widget ≠ Element ≠ RenderObject',`${table(['Layer','Purpose','Lifecycle'],[['Widget','Immutable UI configuration','Cheap to create; often recreated during build.'],['Element','Tree position, identity, dependency tracking, state association','Reused when widget type and key can be matched.'],['RenderObject','Layout, painting, hit-testing','Updated or retained as needed; not every widget owns one.']])}
 <div class="diagram"><div class="diagram-title">What happens when state changes?</div><div class="state-flow"><span>Event / input</span><em>→</em><span>setState()</span><em>→</em><span>Dirty element</span><em>→</em><span>build & reconcile</span></div><div class="state-flow"><span>Layout if needed</span><em>→</em><span>Paint if needed</span><em>→</em><span>Updated pixels</span></div></div>
 ${note('<strong>Production insight:</strong> A widget rebuild is not necessarily a relayout or repaint. The job is to make expensive builds cheap and avoid repeatedly rebuilding large unrelated subtrees.')}`)}
 ${block('3. BuildContext and inherited data',`${para('<code>BuildContext</code> identifies the location of an Element, so values resolved with <code>Theme.of(context)</code> depend on where the widget sits in the tree. Similarly, a nested Navigator, ProviderScope or localization scope may change what a context can access.')}${codeBlock(`@override\nWidget build(BuildContext context) {\n  final theme = Theme.of(context);\n  return Text('Hello Flutter',\n      style: theme.textTheme.headlineMedium);\n}`,'theme_example.dart')}
 ${para('After an asynchronous gap, the widget could be gone. Before using context to navigate or show UI, check that it is still mounted:')}${codeBlock(`Future<void> submit() async {\n  await saveChanges();\n  if (!context.mounted) return;\n  Navigator.of(context).pop();\n}`,'async_context.dart')}
 ${note('<strong>Keys:</strong> Keys help Flutter preserve the right identity when items reorder or move. Prefer stable IDs (e.g. <code>ValueKey(task.id)</code>) over indexes for dynamic lists. GlobalKey is powerful but comes with extra complexity.')}`)}
 </div>`;}
function dart(){return hero('Dart essentials, accelerated','A focused bridge from JavaScript and TypeScript to Flutter’s expressive, null-safe language.',undefined,['Null safety','Named parameters','Async'])+`<div class="chapter-content">
 ${block('1. Your JavaScript → Dart cheat sheet',`${table(['Dart','JavaScript / TypeScript','Note'],[['final name = \'Ada\';','const name = \'Ada\';','Assignable once; the referenced object may still be mutable.'],['const limit = 3;','Compile-time constant','Dart const is stricter than JavaScript const.'],['String? nickname','string | null','Nullable; plain String is non-nullable.'],['List<String>','string[]','Typed, ordered, indexable collection.'],['Map<String, int>','Record<string, number>','Key → value collection.'],['Future<User>','Promise<User>','Single asynchronous result.'],['Stream<int>','Async iterable / observable-like','Sequence of asynchronous events.'],['required this.id','Required constructor parameter','Used extensively in widgets.']])}`)}
 ${block('2. Immutability, null safety and async',`${para('Dart’s null-safety compiler tracks which references may be null. Rather than checking everything at runtime, you model optional values explicitly with <code>?</code>. The null-coalescing operator <code>??</code> provides a fallback.')}${codeBlock(DART_NULL,'dart_basics.dart')}
 ${note('<strong>Nuance:</strong> <code>final</code> fixes a variable binding; it does not recursively freeze a List or Map. <code>const</code> values are compile-time constants and can be canonicalized. Do not add <code>!</code> to suppress null safety without a valid guarantee.','warn')}`)}
 ${block('3. Classes, named parameters and reuse',`${para('Flutter constructors frequently use curly-braced named parameters. These make long widget trees readable and enforce clear APIs.')}${codeBlock(DART_WIDGET,'greeting.dart')}
 ${para('<code>StatelessWidget</code> means the widget has no mutable State object of its own. It can absolutely rebuild when inputs or inherited dependencies change.')}${para('Later, we’ll cover generic types, sealed classes, extension methods, records, pattern matching, Futures, Streams and isolates as full practical lessons—not just a syntax catalog.')}`)}
 </div>`;}
function layout(){return hero('Layouts without CSS','Master flex positioning and the fundamental “constraints go down, sizes go up” rule through experimentation.',undefined,['Flex','Constraints','Responsive'])+`<div class="chapter-content">
 ${block('1. Row, Column, Expanded and Flexible',`${para('A <code>Row</code> lays children out horizontally and a <code>Column</code> vertically. <code>Expanded</code> allocates the remaining space on the parent’s main axis to its child. <code>Flexible</code> gives its child room to flex without necessarily filling all space.')}
 <div class="layout-lab"><div class="lab-head"><strong>↔ Layout laboratory</strong><span class="lab-badge">LIVE DEMO</span></div><div class="mini-heading">DIRECTION</div><div class="segmented"><button class="segment" type="button" data-direction="row">Row →</button><button class="segment" type="button" data-direction="column">Column ↓</button></div><div class="lab-control"><div class="lab-control-head"><span>Gap between children</span><output id="gap-value">${state.layout.gap}px</output></div><input id="gap-range" type="range" min="0" max="32" step="4" value="${state.layout.gap}" aria-label="Gap between children"></div><label class="checkline"><input type="checkbox" id="expand-switch" ${state.layout.flex?'checked':''}>Make the middle child Expanded</label><div class="lab-stage"><div id="layout-preview" class="layout-preview"></div></div><div class="lab-result" id="layout-result" aria-live="polite"></div></div>
 ${codeBlock(DART_LAYOUT,'flex_row.dart')}${note('<strong>Try this:</strong> Change Row to Column. Then imagine the parent gives the Column unbounded height (for example, inside some scrollable contexts). An Expanded child cannot allocate “remaining height” without a finite limit.','warn')}`)}
 ${block('2. The golden constraints rule',`${para('Flutter layout is governed by three constraints-driven steps: <strong>constraints go down, sizes go up, and parents position children</strong>. A child’s requested width never grants permission to exceed tight constraints from its parent.')}
 <div class="constraints-lab"><div class="lab-head"><strong>▣ Constraint simulator</strong><span class="lab-badge">LIVE DEMO</span></div><div class="lab-control"><div class="lab-control-head"><span>Parent width</span><output id="parent-value">260px</output></div><input id="parent-range" type="range" min="140" max="320" step="20" value="260" aria-label="Parent width"></div><div class="lab-control"><div class="lab-control-head"><span>Child requested width</span><output id="child-value">160px</output></div><input id="child-range" type="range" min="60" max="360" step="20" value="160" aria-label="Child requested width"></div><label class="checkline"><input id="loose-switch" type="checkbox" checked>Use loose constraints (Center-like behavior)</label><div class="constraint-stage"><div id="constraint-parent" class="constraint-parent"><div id="constraint-child" class="constraint-child"></div></div></div><div class="constraint-meta" id="constraint-meta"></div><div class="lab-result" id="constraint-result" aria-live="polite"></div></div>
 ${para('The simulator assumes zero minimum width when loose and width = max width when tight; real Flutter widgets can transform both width and height constraints.')}`)}
 ${block('3. Responsive layout fundamentals',`${para('For desktop, tablets and mobile, use available width—not assumptions about device names. <code>LayoutBuilder</code> can select a composition based on the constraints in a particular subtree. <code>MediaQuery</code> supplies viewport size, text scaling and safe area information.')}
 ${codeBlock(`LayoutBuilder(\n  builder: (context, constraints) {\n    final wide = constraints.maxWidth >= 700;\n    return wide\n        ? Row(children: [\n            Expanded(child: NavigationPane()),\n            Expanded(flex: 3, child: ContentPane()),\n          ])\n        : ContentPane();\n  },\n)`,'adaptive_layout.dart')}
 ${note('<strong>Production advice:</strong> Test large accessibility text, small screens, soft keyboards, landscape and split-screen widths. Responsive design is about available space and input modality, not just phones versus desktops.')}`)}
 </div>`;}
function stateLesson(){return hero('State, actions and lifecycles','Use setState correctly, see how state drives a UI, then prepare for real app-level state management.',undefined,['setState','Lifecycle','Derived state'])+`<div class="chapter-content">
 ${block('1. From useState to StatefulWidget',`${para('Unlike a React function component, Flutter uses a separate persistent <code>State</code> object for mutable local state. A StatefulWidget itself remains an immutable configuration object. The State object survives rebuilds while Flutter preserves its identity.')}${codeBlock(DART_STATE,'counter.dart',{dartpad:false})}
 ${para('A callback calls <code>setState()</code> to synchronously change values and schedule a rebuild. It does not immediately repaint the entire application.')}`)}
 ${block('2. Live habit-tracker state',`${para('Tap a habit to update the completion set. Watch the derived percentage and completion message change in response.')}
 <div class="habit-lab"><div class="lab-head"><strong>☑ Habit Lab mini-app</strong><span class="lab-badge">INTERACTIVE</span></div><div class="habit-panel" id="habit-panel" aria-live="polite"></div><div class="state-flow"><span>Tap a checkbox</span><em>→</em><span>Change Set</span><em>→</em><span>setState()</span><em>→</em><span>build()</span></div></div>
 ${note('<strong>Modeling tip:</strong> Count and percentage are derived from the set. Storing them independently creates synchronization bugs. For a real backend-driven app, identify items with stable IDs, not titles.','green')}`)}
 ${block('3. State lifecycle and asynchronous safety',`${para('<code>initState()</code> is for one-time object setup and subscription creation; <code>dispose()</code> releases owned resources. Keep <code>build()</code> pure—do not start network requests, create timers or write to a database inside it.')}${codeBlock(DART_LIFECYCLE,'profile_state.dart')}
 ${para('Do not call <code>setState()</code> after a State is disposed. Cancel subscriptions and check <code>mounted</code> after async gaps. When data must be shared across multiple features or cached asynchronously, introduce a state-management strategy rather than lifting local state through many ancestors.')}`)}
 </div>`;}
function project(){return hero('Build a complete app: Habit Lab','Take everything you have learned and assemble a fully working Material application, ready to run in DartPad or an IDE.',undefined,['Full source','No packages','Android / iOS / web'])+`<div class="chapter-content">
 ${block('1. Scaffold a real project',`${para('The following steps create a Flutter project and launch it in Chrome. Install the Flutter SDK first and make sure <code>flutter doctor</code> reports the toolchains you need.')}${codeBlock(BASH_SETUP,'Terminal')}${note('<strong>DartPad shortcut:</strong> For the first lesson, you can skip local installation. Copy the full Dart source below and choose Flutter mode in <a href="https://dartpad.dev/" target="_blank" rel="noopener noreferrer">DartPad</a>.')}`)}
 ${block('2. Full copyable main.dart',`${para('Replace <code>lib/main.dart</code> with this standalone implementation. It uses stable keys, a reusable child widget, derived progress and a lazily constructed list.')}${codeBlock(DART_FULL,'lib/main.dart',{dartpad:true})}`)}
 ${block('3. Understanding the implementation',`${table(['Component / technique','Job','Production implication'],[['HabitLabApp','Application configuration','Keeps theme and routing infrastructure centralized.'],['HabitDashboard + State','Owns the mutable set of completed habits','Avoids global mutable variables.'],['_toggleHabit()','Single event-driven mutation pathway','Allows controlled state transitions.'],['doneCount / progress','Computed from current inputs','Avoids stale duplicate state.'],['HabitRow','Extracted reusable view','Easy to reuse, test and optimize.'],['ListView.builder','Lazily constructs rows','A good foundation for lists that grow.'],['ValueKey(habit)','Helps match items by stable identity','In production, prefer an immutable unique ID.'],['ConstrainedBox','Caps content width on large screens','Avoids excessively stretched desktop layouts.']])}
 ${note('<strong>Mini design review:</strong> Because the list is only three items, laziness does not matter yet. We still use <code>ListView.builder</code> to demonstrate a pattern that scales. All state is in-memory and resets after app restart; persistence comes later.')}`)}
 </div>`;}
function production(){return hero('Production optimization, from day one','Learn which work is expensive, how to measure it, and what genuinely improves a Flutter application.',undefined,['Rebuilds','Images','Profiling','Web'])+`<div class="chapter-content">
 ${block('1. Build performance: optimize the right things',`${para('Flutter may call <code>build()</code> often. The goal is to keep it cheap and avoid asking huge portions of the tree to rebuild for small unrelated state changes. A rebuild does not always lead to layout or paint.')}${codeBlock(DART_PERF,'optimized_list.dart')}
 ${table(['Technique','Benefit','Caution'],[['Small reusable widget classes','Limits the scope of reactive dependencies and rebuild work','Extraction alone does not guarantee zero child rebuilds.'],['const constructors','Canonicalization can help reuse immutable configurations','Use where valid, without forcing it everywhere.'],['ListView.builder / slivers','Lazy child creation for long scrolling collections','API pagination is still separate.'],['Stable ValueKey IDs','Correct element matching when items reorder','Avoid duplicate labels or index-based keys for mutable lists.'],['Caching expensive transforms','Reduces repeated sorting, parsing or filtering','Simple calculations inside build are harmless.']])}`)}
 ${block('2. Frames, images and CPU',`${para('At 60Hz, the frame interval is about 16.7ms; 120Hz displays give about 8.3ms. Flutter must coordinate UI and raster work to render smooth motion. Measure frame timelines with DevTools in <strong>profile mode on representative devices</strong> rather than relying on debug-mode timing.')}
 <div class="concept-grid"><div class="concept"><div class="concept-icon">◷</div><strong>CPU / isolates</strong><p>Move significant parsing or CPU-heavy work off the main isolate when it risks blocking input or animation.</p></div><div class="concept"><div class="concept-icon">▧</div><strong>Image memory</strong><p>Prefer sensibly sized images and decode dimensions. Watch memory use on older phones.</p></div><div class="concept"><div class="concept-icon">⚡</div><strong>Painting costs</strong><p>Limit unnecessarily expensive clipping, saveLayer operations and effects in scrolling content.</p></div></div>
 ${note('<strong>Profile before changing code:</strong> Flutter DevTools includes performance, widget rebuild and memory tools. Track the actual bottleneck and repeat the measurement after each change.','green')}
 ${codeBlock(BASH_CHECKS,'Production quality commands')}`)}
 ${block('3. Production architecture and platform realities',`${table(['Area','Baseline for a serious app'],[['Networking','Timeouts, cancellation, explicit errors, retries where safe and structured models.'],['Security','Never place service-role keys or long-lived server secrets in client builds. Store credentials using appropriate platform mechanisms.'],['Observability','Crash reporting, structured diagnostics, privacy-safe event metadata and release identifiers.'],['Offline','Define cache lifetime, conflict resolution and retry/outbox behavior.'],['Testing','Unit + widget + integration coverage for critical flows; automate in CI.'],['Web','Use URL-addressable routing and decide where SEO-friendly HTML pages make more sense.'],['Accessibility','Semantics, contrast, input focus, labels, large text and reduced motion.']])}
 ${para('We will implement these principles incrementally, not attempt to install every system into the small Habit Lab example.')}`)}
 </div>`;}
function testing(){return hero('Quality, testing and accessibility','Test behavior from the user’s perspective and make your Flutter interface usable across input methods.',undefined,['Widget tests','CI commands','Semantics'])+`<div class="chapter-content">
 ${block('1. Testing layers',`${divLayers()}${para('Unit tests validate business logic without UI. Widget tests render a widget tree and simulate interactions. Integration tests run broader flows with platform services and navigation. Golden tests can flag unintended visual changes but require controlled environments.')}`)}
 ${block('2. First real widget test',`${para('Create <code>test/habit_dashboard_test.dart</code> and paste the test below. It builds the actual application, taps a habit and verifies the resulting displayed progress.')}${codeBlock(DART_TEST,'test/habit_dashboard_test.dart')}${para('Add a regression test for Reset:')}${codeBlock(DART_RESET_TEST,'test/habit_dashboard_test.dart · second test')}${codeBlock(`dart format .\nflutter analyze\nflutter test`,'Terminal')}`)}
 ${block('3. What about accessibility?',`${para('Widget tests are more robust when they locate controls by semantics and stable keys rather than brittle visual arrangement. A production app should support screen reader announcements, a meaningful focus order, adequate contrast, large text settings and keyboard/switch input.')}${note('<strong>Testing tip:</strong> Avoid asserting incidental implementation details when you can verify the behavior the user experiences. A test should still pass if you replace a Row with a Column without changing its functionality.','green')}`)}
 </div>`;}
function divLayers(){return '<div class="concept-grid"><div class="concept"><div class="concept-icon">1</div><strong>Unit tests</strong><p>Pure Dart logic, validation and state transformations.</p></div><div class="concept"><div class="concept-icon">2</div><strong>Widget tests</strong><p>Build UI in a test harness and interact with controls.</p></div><div class="concept"><div class="concept-icon">3</div><strong>Integration tests</strong><p>Real app flows, navigation and platform-specific behavior.</p></div></div>';}
function libraries(){
 const list=[
 ['STATE','flutter_riverpod','Shared reactive and asynchronous state; explicit providers; caching.', 'https://pub.dev/packages/flutter_riverpod'],
 ['STATE','flutter_bloc','Predictable event/state and Cubit patterns for structured state flows.', 'https://pub.dev/packages/flutter_bloc'],
 ['ROUTING','go_router','Declarative URL routes, nested navigation, redirection and deep links.','https://pub.dev/packages/go_router'],
 ['NETWORKING','dio','HTTP client with interceptors, cancellation, timeout configuration and other tooling.','https://pub.dev/packages/dio'],
 ['NETWORKING','http','Lightweight HTTP client for simple requests.','https://pub.dev/packages/http'],
 ['MODELS','freezed','Immutable data classes and union-style modeling, typically via code generation.','https://pub.dev/packages/freezed'],
 ['MODELS','json_serializable','Generate JSON model mapping and avoid repetitive handwritten parsing.','https://pub.dev/packages/json_serializable'],
 ['BACKEND','supabase_flutter','Supabase client for authentication, database, storage and realtime.','https://pub.dev/packages/supabase_flutter'],
 ['LOCAL DATA','drift','Reactive relational local persistence for offline-capable apps.','https://pub.dev/packages/drift'],
 ['SETTINGS','shared_preferences','Small app preferences (not protected secrets).','https://pub.dev/packages/shared_preferences'],
 ['SECRETS','flutter_secure_storage','Platform-specific secure storage where supported.','https://pub.dev/packages/flutter_secure_storage'],
 ['IMAGES','cached_network_image','Network images and native caching; web persistence differs.','https://pub.dev/packages/cached_network_image'],
 ['LOCALIZATION','intl','Date/number formatting and internationalization support.','https://pub.dev/packages/intl'],
 ['TESTING','mocktail','Mock classes and interactions for unit and widget testing.','https://pub.dev/packages/mocktail'],
 ['MONITORING','sentry_flutter','Capture runtime errors, performance diagnostics and release issues.','https://pub.dev/packages/sentry_flutter'],
 ];
 return hero('The essential Flutter library toolkit','Know what to use, why you need it, and when the built-in framework API is sufficient.',undefined,['Packages','Architecture','Tradeoffs'])+`<div class="chapter-content">${block('Choose dependencies for a reason',`${para('The Flutter ecosystem offers powerful packages, but installing more is not inherently better. Start with framework APIs, identify the missing capability, and only then add a package. Evaluate platform support, maintenance, license, security and upgrade compatibility.')}
 <div class="library-grid">${list.map(([category,name,detail,url])=>`<article class="library-card"><small>${category}</small><strong>${name}</strong><p>${detail}</p><a href="${url}" target="_blank" rel="noopener noreferrer">View on pub.dev ↗</a></article>`).join('')}</div>`)}
 ${block('A suggested real-world stack',`${para('For a future production-ready cross-platform app, a pragmatic default could be <strong>Riverpod + go_router + Dio + Freezed</strong> with <strong>Supabase</strong> for backend features and <strong>Drift</strong> when offline relational persistence is needed. These are not prerequisites for Lesson 1.')}${note('<strong>Platform caution:</strong> Many packages expose different capabilities on Android, iOS and the browser. Secure-storage and cached-image behavior are not identical across platforms. Read the package’s platform table and verify features before depending on them.','warn')}`)}
 </div>`;
}
function exercises(){return hero('Practice makes concepts stick','Complete coding challenges, check your understanding and record your progress in this browser.',undefined,['Hands-on','3 quizzes','Saved progress'])+`<div class="chapter-content">
 ${block('Your five coding exercises',`${para('Modify the Habit Lab code yourself. Tick a challenge when you have implemented and run it—not simply after reading its hint.')}
 <div id="exercise-list">${EXERCISES.map((ex,i)=>`<label class="exercise-item ${state.exercises.includes(i)?'complete':''}" data-exercise-container="${i}"><input type="checkbox" data-exercise="${i}" ${state.exercises.includes(i)?'checked':''}><span style="flex:1"><strong>${esc(ex.title)}</strong><p>${esc(ex.detail)}</p><button type="button" class="lab-action" data-hint="${i}" aria-expanded="false">Show hint</button><span class="exercise-hint" id="hint-${i}" hidden style="display:block;font-size:12px;color:var(--muted);padding-top:9px"></span></span></label>`).join('')}</div><div class="check-stats" id="exercise-stats"></div>`)}
 ${block('Knowledge check',`${para('Select one response for each question. Each answer provides immediate feedback, and your responses are retained locally.')}
 <div id="quiz-list">${MCQS.map((q,i)=>`<div class="mini-card" style="margin:12px 0"><strong style="font-size:14px">${i+1}. ${esc(q.q)}</strong><div role="group" aria-label="${esc(q.q)}">${q.opts.map((o,j)=>`<label class="quiz-option"><input type="radio" name="quiz-${i}" value="${j}" data-quiz="${i}" ${state.quiz[i]===j?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div><div class="quiz-feedback" id="quiz-feedback-${i}" aria-live="polite"></div></div>`).join('')}</div><div class="check-stats" id="quiz-stats"></div>`)}
 ${block('What comes after Lesson 1?',`${para('The next planned module deepens your knowledge of Dart: records, generics, patterns, asynchronous streams and isolates. You can already review the ') +link('roadmap','complete 12-module learning path') +'.'}${note('<strong>Course status:</strong> Lesson 1 is fully written and interactive. The remaining modules are currently a curriculum roadmap, not completed lessons.','warn')}`)}
 </div>`;
}
function roadmap(){return `<div class="overview-hero"><div><span class="kicker">YOUR PATH TO PRODUCTION</span><h1>From first widget<br>to release-ready.</h1><p>A 12-module curriculum spanning Dart, adaptive interfaces, architecture, data, platform capabilities, performance and delivery.</p><div class="hero-chips"><span class="chip">Module 1 available</span><span class="chip">Modules 2–12 planned</span></div></div><div class="overview-mark" aria-hidden="true">12</div></div><div class="overview-section-heading" style="margin-top:32px"><h2>The complete roadmap</h2></div><div class="roadmap-grid">${MODULES.map(([name,description,project,status],i)=>`<article class="roadmap-card"><span class="roadmap-number">MODULE ${String(i+1).padStart(2,'0')}</span><h3>${esc(name)}</h3><p>${esc(description)}</p><div style="font-size:11px;color:var(--muted)">PROJECT · ${esc(project)}</div><footer><span class="status-pill ${i===0?'available':''}">${status}</span>${i===0?`<a class="btn-link" href="#/mental-model">Explore lesson →</a>`:''}</footer></article>`).join('')}</div>${note('<strong>Learning strategy:</strong> Start with pure Flutter and Dart. Add packages, backends and architectural complexity only when a practical project needs them. Revisit performance, accessibility and testing at every stage—not only at the end.','green')}`;}

function currentRoute(){const route=decodeURIComponent(location.hash.replace(/^#\/?/,''));return SECTIONS.find(s=>s.id===route)?.id||'overview';}
function countCompleted(){return state.completed.filter(id=>TRACKED.some(s=>s.id===id)).length;}
function saveCompleted(){safeSet('completed',state.completed);renderNavigation($('#nav-search').value);updateProgress();}
function updateProgress(){const done=countCompleted();$('#side-progress-text').textContent=`${done} / ${TRACKED.length}`;$('#side-progress-fill').style.width=`${done/TRACKED.length*100}%`;}
function renderNavigation(query=''){
 const lower=query.trim().toLowerCase();let html='<div class="nav-group-label">LESSON 1 · GET STARTED</div>';
 for(const [i,s] of SECTIONS.entries()){
  if(s.id==='roadmap') continue;
  if(lower && !(s.title+' '+s.short+' '+s.id).toLowerCase().includes(lower)) continue;
  let n=s.id==='overview'?'⌂':String(i).padStart(2,'0');
  html+=`<a class="nav-link ${s.id===state.active?'active':''} ${state.completed.includes(s.id)?'done':''}" href="#/${s.id}" ${s.id===state.active?'aria-current="page"':''}><span class="nav-num">${n}</span><span class="nav-link-title">${esc(s.title)}</span><span class="nav-minutes">${state.completed.includes(s.id)?'✓':s.minutes+'m'}</span></a>`;
 }
 if(lower && !SECTIONS.some(s=>s.id!=='roadmap'&&(s.title+' '+s.short+' '+s.id).toLowerCase().includes(lower)) && !('roadmap full course roadmap').includes(lower)) html+='<div class="nav-empty">No matching chapters.</div>';
 html+='<div class="nav-divider"></div><div class="nav-group-label">UP NEXT</div>';
 if(!lower || 'full course roadmap upcoming modules'.includes(lower)) html+='<a class="nav-link '+(state.active==='roadmap'?'active':'')+'" href="#/roadmap"><span class="nav-num">↗</span><span class="nav-link-title">12-module roadmap</span><span class="nav-minutes">4m</span></a>';
 $('#lesson-nav').innerHTML=html;
 updateProgress();
}
function sectionFooter(){
 if(state.active==='overview'||state.active==='roadmap')return '';
 const idx=TRACKED.findIndex(s=>s.id===state.active),prev=TRACKED[idx-1],next=TRACKED[idx+1];const done=state.completed.includes(state.active);
 return `<div class="section-footer"><button type="button" class="lab-action ${done?'':'primary'}" id="mark-complete" aria-pressed="${done}">${done?'✓ Chapter marked as read':'✓ Mark chapter as read'}</button><div class="footer-nav">${prev?`<a class="action-btn secondary" href="#/${prev.id}">← Previous</a>`:`<a class="small-link" href="#/overview">← Overview</a>`}${next?`<a class="action-btn" href="#/${next.id}">Next chapter →</a>`:`<a class="action-btn" href="#/roadmap">Course roadmap →</a>`}</div></div>`;
}
const renderer={'overview':overview,'mental-model':mental,'widget-tree':widgetTree,'dart':dart,'layout':layout,'state':stateLesson,'project':project,'production':production,'testing':testing,'libraries':libraries,'exercises':exercises,'roadmap':roadmap};
function render(){
 state.active=currentRoute();codeBlock.pool.clear();codeBlock.counter=0;
 let content=renderer[state.active]();
 $('#main').innerHTML=content+sectionFooter();
 const section=SECTIONS.find(s=>s.id===state.active);
 crumb(section.title);
 renderNavigation($('#nav-search').value);
 document.title=(state.active==='overview'?'Learn Flutter by building':section.title)+' · Flutter Fieldguide';
 closeSidebar();
 if(state.active==='widget-tree')updateTree();
 if(state.active==='layout'){updateLayout();updateConstraints();}
 if(state.active==='state')updateHabits();
 if(state.active==='exercises'){updateExercises();updateQuizzes();}
 window.scrollTo({top:0,behavior:'instant'});
}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400);}
function closeSidebar(){const sb=$('#sidebar');sb.classList.remove('open');$('#scrim').classList.remove('visible');$('#menu-button').setAttribute('aria-expanded','false');}
function toggleSidebar(){const sb=$('#sidebar'),open=!sb.classList.contains('open');sb.classList.toggle('open',open);$('#scrim').classList.toggle('visible',open);$('#menu-button').setAttribute('aria-expanded',String(open));}
function setTheme(theme){state.theme=theme==='dark'?'dark':'light';document.documentElement.dataset.theme=state.theme;$('#theme-button').textContent=state.theme==='dark'?'☀':'☾';$('#theme-button').title=state.theme==='dark'?'Switch to light theme':'Switch to dark theme';safeSet('theme',state.theme);}
function updateTree(){const node=TREE.find(t=>t.id===state.tree)||TREE[0];const el=$('#widget-detail');if(!el)return;el.innerHTML=`<span class="widget-detail-tag">${esc(node.tag)}</span><h3>${esc(node.id)}</h3><p>${esc(node.description)}</p><div class="note">${esc(node.details)}</div>`;document.querySelectorAll('[data-tree]').forEach(b=>{const selected=b.dataset.tree===node.id;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);});}
function updateLayout(){
 const root=$('#layout-preview');if(!root)return;
 const {direction,gap,flex}=state.layout;
 document.querySelectorAll('[data-direction]').forEach(btn=>{const active=btn.dataset.direction===direction;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',active);});
 $('#gap-range').value=gap;$('#gap-value').textContent=gap+'px';$('#expand-switch').checked=flex;
 root.className='layout-preview'+(direction==='column'?' column':'');root.style.gap=gap+'px';
 root.innerHTML=`<div class="layout-box box1"><b>⌂</b>Home</div><div class="layout-box box2 ${flex?'flex':''}"><b>⌕</b>Explore</div><div class="layout-box box3"><b>◇</b>Profile</div>`;
 $('#layout-result').innerHTML=`<strong>Flutter concept:</strong> <code>${direction==='row'?'Row':'Column'}(children: [...${flex?'Expanded(child: Explore())':'Explore()'}, ...])</code> — <strong>${gap}px</strong> of preview spacing. ${flex?'The middle item consumes available space along the main axis.':'Each item uses only its allocated content size.'} This HTML preview illustrates the equivalent layout behavior.`;
}
function updateConstraints(){const {parent,child,loose}=state.constraints;const effective=loose?Math.min(parent,child):parent;
 for(const [id,v] of [['parent-value',parent],['child-value',child]]){const el=$('#'+id);if(el)el.textContent=v+'px';}
 const parentEl=$('#constraint-parent'),childEl=$('#constraint-child');if(!parentEl||!childEl)return;
 parentEl.style.width=parent+'px';childEl.style.width=effective+'px';childEl.textContent=effective+'px';
 $('#constraint-meta').innerHTML=`<span class="chip">Parent: ${parent}px</span><span class="chip">Requested: ${child}px</span><span class="chip accent">Rendered: ${effective}px</span>`;
 $('#constraint-result').textContent=loose?`Loose constraints let the child choose up to ${parent}px. It asks for ${child}px and gets ${effective}px in this simplified model.`:`Tight constraints require width ${parent}px, so the child's preferred ${child}px is overridden.`;
}
function updateHabits(){const el=$('#habit-panel');if(!el)return;const done=state.habits.length;
 el.innerHTML=`<div class="habit-panel-head"><div><span class="mini-heading">TODAY’S PROGRESS</span><div class="habit-count">${done} / ${HABITS.length}</div></div><span class="chip accent">${Math.round(done/HABITS.length*100)}% complete</span></div><div class="progress-track"><div class="progress-fill" style="width:${done/HABITS.length*100}%"></div></div><div class="habit-list">${HABITS.map((label,i)=>`<label class="habit-item ${state.habits.includes(i)?'completed':''}"><input type="checkbox" data-habit="${i}" ${state.habits.includes(i)?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div><div class="action-row" style="justify-content:space-between;align-items:center;margin-top:16px"><span class="check-stats">${done===HABITS.length?'🎉 All habits completed!':'Keep going, you’ve got this.'}</span><button type="button" class="lab-action" id="habit-reset" ${done===0?'disabled':''}>Reset</button></div>`;
}
function updateExercises(){const stats=$('#exercise-stats');if(stats)stats.textContent=`${state.exercises.length} of ${EXERCISES.length} coding challenges completed`;document.querySelectorAll('[data-exercise-container]').forEach(el=>el.classList.toggle('complete',state.exercises.includes(Number(el.dataset.exerciseContainer))));}
function updateQuizzes(){let answered=0,correct=0;
 MCQS.forEach((q,i)=>{const feedback=$('#quiz-feedback-'+i);if(!feedback)return;const answer=state.quiz[i];if(answer!==undefined){answered++;if(answer===q.correct)correct++;const ok=answer===q.correct;feedback.className='quiz-feedback '+(ok?'correct':'');feedback.innerHTML=`<strong>${ok?'✓ Correct!':'Try again.'}</strong> ${esc(q.why)}`;}else{feedback.className='quiz-feedback';feedback.textContent='';}});
 const el=$('#quiz-stats');if(el)el.textContent=`${correct} correct of ${MCQS.length} · ${answered} answered`;
}
async function clipboard(text){
 try{await navigator.clipboard.writeText(text);toast('Code copied to clipboard');}
 catch{const temp=document.createElement('textarea');temp.value=text;temp.style.position='fixed';temp.style.opacity='0';document.body.appendChild(temp);temp.select();const ok=document.execCommand('copy');temp.remove();toast(ok?'Code copied to clipboard':'Select the code to copy it');}
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-copy')){clipboard(codeBlock.pool.get(b.dataset.copy));return;}
 if(b.hasAttribute('data-dartpad')){window.open('https://dartpad.dev/','_blank','noopener,noreferrer');clipboard(codeBlock.pool.get(b.dataset.dartpad));return;}
 if(b.hasAttribute('data-tree')){state.tree=b.dataset.tree;updateTree();return;}
 if(b.hasAttribute('data-direction')){state.layout.direction=b.dataset.direction;safeSet('layout',state.layout);updateLayout();return;}
 if(b.id==='habit-reset'){state.habits=[];safeSet('habits',state.habits);updateHabits();return;}
 if(b.id==='mark-complete'){const id=state.active;state.completed=state.completed.includes(id)?state.completed.filter(x=>x!==id):[...state.completed,id];saveCompleted();b.classList.toggle('primary',!state.completed.includes(id));b.setAttribute('aria-pressed',String(state.completed.includes(id)));b.textContent=state.completed.includes(id)?'✓ Chapter marked as read':'✓ Mark chapter as read';toast(state.completed.includes(id)?'Chapter added to your progress':'Chapter marked unread');return;}
 if(b.hasAttribute('data-hint')){const id=b.dataset.hint,el=$('#hint-'+id);if(!el)return;const currentlyOpen=!el.hidden;el.hidden=currentlyOpen;el.textContent=EXERCISES[Number(id)].hint;b.textContent=currentlyOpen?'Show hint':'Hide hint';b.setAttribute('aria-expanded',String(!currentlyOpen));return;}
});
document.addEventListener('input',event=>{
 const e=event.target;if(e.id==='gap-range'){state.layout.gap=Number(e.value);safeSet('layout',state.layout);updateLayout();}
 if(e.id==='parent-range'){state.constraints.parent=Number(e.value);updateConstraints();}
 if(e.id==='child-range'){state.constraints.child=Number(e.value);updateConstraints();}
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.id==='expand-switch'){state.layout.flex=el.checked;safeSet('layout',state.layout);updateLayout();}
 if(el.id==='loose-switch'){state.constraints.loose=el.checked;updateConstraints();}
 if(el.hasAttribute('data-habit')){const n=Number(el.dataset.habit);state.habits=el.checked?[...new Set([...state.habits,n])]:state.habits.filter(x=>x!==n);safeSet('habits',state.habits);updateHabits();}
 if(el.hasAttribute('data-exercise')){const n=Number(el.dataset.exercise);state.exercises=el.checked?[...new Set([...state.exercises,n])]:state.exercises.filter(x=>x!==n);safeSet('exercises',state.exercises);updateExercises();}
 if(el.hasAttribute('data-quiz')){state.quiz[el.dataset.quiz]=Number(el.value);safeSet('quiz',state.quiz);updateQuizzes();}
});
$('#menu-button').addEventListener('click',toggleSidebar);
$('#scrim').addEventListener('click',closeSidebar);
$('#theme-button').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));
$('#nav-search').addEventListener('input',e=>renderNavigation(e.target.value));
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){closeSidebar();if(document.activeElement===$('#nav-search'))$('#nav-search').blur();}
 if((event.key==='/'||((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'))&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){
  event.preventDefault();if(innerWidth<=920)toggleSidebar();$('#nav-search').focus();$('#nav-search').select();
 }
});
window.addEventListener('hashchange',render);
window.addEventListener('resize',()=>{if(innerWidth>920)closeSidebar();});
setTheme(state.theme);
render();
