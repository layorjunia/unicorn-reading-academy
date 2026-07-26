// Word banks — the deep practice vocabulary for every island.
// Format: 'word:s1.s2.s3' where s-tokens are the sound units (graphemes).
// If tiles for building differ from sound units (magic-e words), a second
// segmentation follows after '|' (letter tiles). Practice Mode and the
// Daily Quest sample from these banks, so every session is different.

const BANKS = {
  'L1-1': [
    'cat:c.a.t','hat:h.a.t','mat:m.a.t','rat:r.a.t','bat:b.a.t','sat:s.a.t','pat:p.a.t',
    'fan:f.a.n','man:m.a.n','pan:p.a.n','can:c.a.n','ran:r.a.n','tan:t.a.n',
    'bag:b.a.g','rag:r.a.g','tag:t.a.g','wag:w.a.g','map:m.a.p','cap:c.a.p','lap:l.a.p','nap:n.a.p',
    'jam:j.a.m','ram:r.a.m','dad:d.a.d','sad:s.a.d','mad:m.a.d','bad:b.a.d',
    'big:b.i.g','pig:p.i.g','dig:d.i.g','wig:w.i.g','fig:f.i.g',
    'pin:p.i.n','win:w.i.n','tin:t.i.n','fin:f.i.n','bin:b.i.n',
    'sit:s.i.t','hit:h.i.t','fit:f.i.t','bit:b.i.t','kit:k.i.t',
    'lid:l.i.d','hid:h.i.d','rid:r.i.d','dip:d.i.p','hip:h.i.p','rip:r.i.p','tip:t.i.p','zip:z.i.p','sip:s.i.p','six:s.i.x'
  ],
  'L1-2': [
    'dog:d.o.g','log:l.o.g','fog:f.o.g','hog:h.o.g','jog:j.o.g',
    'cot:c.o.t','dot:d.o.t','got:g.o.t','hot:h.o.t','lot:l.o.t','not:n.o.t','pot:p.o.t',
    'box:b.o.x','fox:f.o.x','mop:m.o.p','top:t.o.p','pop:p.o.p','hop:h.o.p','mom:m.o.m','job:j.o.b',
    'bug:b.u.g','rug:r.u.g','jug:j.u.g','mug:m.u.g','hug:h.u.g','dug:d.u.g',
    'tub:t.u.b','cub:c.u.b','rub:r.u.b','sun:s.u.n','run:r.u.n','fun:f.u.n','bun:b.u.n',
    'nut:n.u.t','cut:c.u.t','hut:h.u.t','cup:c.u.p','pup:p.u.p','bus:b.u.s',
    'bed:b.e.d','red:r.e.d','fed:f.e.d','led:l.e.d','leg:l.e.g','beg:b.e.g','peg:p.e.g',
    'pen:p.e.n','hen:h.e.n','ten:t.e.n','men:m.e.n','den:d.e.n',
    'net:n.e.t','pet:p.e.t','vet:v.e.t','wet:w.e.t','jet:j.e.t','let:l.e.t','get:g.e.t'
  ],
  'L1-3': [
    'ship:sh.i.p','shop:sh.o.p','shed:sh.e.d','shin:sh.i.n','shut:sh.u.t','shell:sh.e.ll',
    'fish:f.i.sh','dish:d.i.sh','wish:w.i.sh','rush:r.u.sh','mash:m.a.sh','cash:c.a.sh','dash:d.a.sh','hush:h.u.sh',
    'chat:ch.a.t','chip:ch.i.p','chin:ch.i.n','chop:ch.o.p','chug:ch.u.g','rich:r.i.ch','much:m.u.ch','such:s.u.ch',
    'chick:ch.i.ck','check:ch.e.ck','lunch:l.u.n.ch','munch:m.u.n.ch','bunch:b.u.n.ch',
    'thin:th.i.n','thick:th.i.ck','thud:th.u.d','path:p.a.th','bath:b.a.th','math:m.a.th','moth:m.o.th','with:w.i.th',
    'when:wh.e.n','whip:wh.i.p','whiz:wh.i.z','which:wh.i.ch',
    'duck:d.u.ck','luck:l.u.ck','sock:s.o.ck','rock:r.o.ck','kick:k.i.ck','lick:l.i.ck','pick:p.i.ck','tick:t.i.ck',
    'pack:p.a.ck','back:b.a.ck','sack:s.a.ck','neck:n.e.ck','deck:d.e.ck','dock:d.o.ck'
  ],
  'L1-4': [
    'stop:s.t.o.p','step:s.t.e.p','stem:s.t.e.m','spin:s.p.i.n','spot:s.p.o.t','spun:s.p.u.n',
    'snap:s.n.a.p','snip:s.n.i.p','slam:s.l.a.m','slip:s.l.i.p','slid:s.l.i.d','sled:s.l.e.d','slug:s.l.u.g',
    'swim:s.w.i.m','flag:f.l.a.g','flip:f.l.i.p','flat:f.l.a.t','flop:f.l.o.p',
    'plan:p.l.a.n','plum:p.l.u.m','plus:p.l.u.s','plug:p.l.u.g','glad:g.l.a.d',
    'clip:c.l.i.p','clap:c.l.a.p','club:c.l.u.b','drum:d.r.u.m','drip:d.r.i.p','drop:d.r.o.p','drag:d.r.a.g',
    'trip:t.r.i.p','trap:t.r.a.p','grab:g.r.a.b','grin:g.r.i.n','grip:g.r.i.p',
    'crab:c.r.a.b','crib:c.r.i.b','brag:b.r.a.g','frog:f.r.o.g','from:f.r.o.m','twin:t.w.i.n'
  ],
  'L1-5': [
    'and:a.n.d','band:b.a.n.d','hand:h.a.n.d','land:l.a.n.d','sand:s.a.n.d','bend:b.e.n.d','send:s.e.n.d','wind:w.i.n.d','pond:p.o.n.d',
    'camp:c.a.m.p','damp:d.a.m.p','lamp:l.a.m.p','ramp:r.a.m.p','bump:b.u.m.p','dump:d.u.m.p','jump:j.u.m.p','lump:l.u.m.p','pump:p.u.m.p',
    'hunt:h.u.n.t','best:b.e.s.t','nest:n.e.s.t','rest:r.e.s.t','test:t.e.s.t','vest:v.e.s.t','west:w.e.s.t',
    'fast:f.a.s.t','last:l.a.s.t','past:p.a.s.t','list:l.i.s.t','fist:f.i.s.t','must:m.u.s.t','just:j.u.s.t','dust:d.u.s.t',
    'bent:b.e.n.t','dent:d.e.n.t','sent:s.e.n.t','tent:t.e.n.t','went:w.e.n.t','mint:m.i.n.t','hint:h.i.n.t',
    'milk:m.i.l.k','silk:s.i.l.k','belt:b.e.l.t','melt:m.e.l.t','felt:f.e.l.t','help:h.e.l.p','gulp:g.u.l.p',
    'raft:r.a.f.t','left:l.e.f.t','gift:g.i.f.t','lift:l.i.f.t','soft:s.o.f.t'
  ],
  'L1-6': [
    'ring:r.ing','king:k.ing','sing:s.ing','wing:w.ing','zing:z.ing','bring:b.r.ing','sting:s.t.ing','swing:s.w.ing','thing:th.ing',
    'rang:r.ang','sang:s.ang','bang:b.ang','hang:h.ang','gang:g.ang',
    'bank:b.ank','tank:t.ank','sank:s.ank','rank:r.ank','blank:b.l.ank','crank:c.r.ank','thank:th.ank',
    'pink:p.ink','sink:s.ink','wink:w.ink','link:l.ink','mink:m.ink','blink:b.l.ink','drink:d.r.ink','think:th.ink','stink:s.t.ink',
    'ball:b.all','call:c.all','fall:f.all','hall:h.all','tall:t.all','wall:w.all','mall:m.all','small:s.m.all'
  ],
  'L2-1': [
    'cake:c.a_e.k|c.a.k.e','bake:b.a_e.k|b.a.k.e','lake:l.a_e.k|l.a.k.e','make:m.a_e.k|m.a.k.e','rake:r.a_e.k|r.a.k.e','take:t.a_e.k|t.a.k.e','wake:w.a_e.k|w.a.k.e',
    'cane:c.a_e.n|c.a.n.e','lane:l.a_e.n|l.a.n.e','mane:m.a_e.n|m.a.n.e','cape:c.a_e.p|c.a.p.e','tape:t.a_e.p|t.a.p.e',
    'gate:g.a_e.t|g.a.t.e','late:l.a_e.t|l.a.t.e','date:d.a_e.t|d.a.t.e','game:g.a_e.m|g.a.m.e','name:n.a_e.m|n.a.m.e','same:s.a_e.m|s.a.m.e','tame:t.a_e.m|t.a.m.e',
    'cave:c.a_e.v|c.a.v.e','gave:g.a_e.v|g.a.v.e','save:s.a_e.v|s.a.v.e','wave:w.a_e.v|w.a.v.e',
    'plate:p.l.a_e.t|p.l.a.t.e','snake:s.n.a_e.k|s.n.a.k.e','grape:g.r.a_e.p|g.r.a.p.e','shake:sh.a_e.k|sh.a.k.e','brave:b.r.a_e.v|b.r.a.v.e','flame:f.l.a_e.m|f.l.a.m.e',
    'ride:r.i_e.d|r.i.d.e','hide:h.i_e.d|h.i.d.e','side:s.i_e.d|s.i.d.e','wide:w.i_e.d|w.i.d.e',
    'bike:b.i_e.k|b.i.k.e','hike:h.i_e.k|h.i.k.e','like:l.i_e.k|l.i.k.e','dime:d.i_e.m|d.i.m.e','lime:l.i_e.m|l.i.m.e','time:t.i_e.m|t.i.m.e',
    'fine:f.i_e.n|f.i.n.e','line:l.i_e.n|l.i.n.e','mine:m.i_e.n|m.i.n.e','nine:n.i_e.n|n.i.n.e','pine:p.i_e.n|p.i.n.e','vine:v.i_e.n|v.i.n.e',
    'bite:b.i_e.t|b.i.t.e','kite:k.i_e.t|k.i.t.e','five:f.i_e.v|f.i.v.e','hive:h.i_e.v|h.i.v.e','dive:d.i_e.v|d.i.v.e','drive:d.r.i_e.v|d.r.i.v.e',
    'smile:s.m.i_e.l|s.m.i.l.e','slide:s.l.i_e.d|s.l.i.d.e','shine:sh.i_e.n|sh.i.n.e','white:wh.i_e.t|wh.i.t.e','prize:p.r.i_e.z|p.r.i.z.e'
  ],
  'L2-2': [
    'bone:b.o_e.n|b.o.n.e','cone:c.o_e.n|c.o.n.e','zone:z.o_e.n|z.o.n.e','home:h.o_e.m|h.o.m.e','dome:d.o_e.m|d.o.m.e',
    'nose:n.o_e.z|n.o.s.e','rose:r.o_e.z|r.o.s.e','hose:h.o_e.z|h.o.s.e','note:n.o_e.t|n.o.t.e','vote:v.o_e.t|v.o.t.e',
    'rope:r.o_e.p|r.o.p.e','hope:h.o_e.p|h.o.p.e','pole:p.o_e.l|p.o.l.e','hole:h.o_e.l|h.o.l.e','mole:m.o_e.l|m.o.l.e',
    'stone:s.t.o_e.n|s.t.o.n.e','stole:s.t.o_e.l|s.t.o.l.e','woke:w.o_e.k|w.o.k.e','poke:p.o_e.k|p.o.k.e','joke:j.o_e.k|j.o.k.e','smoke:s.m.o_e.k|s.m.o.k.e',
    'drove:d.r.o_e.v|d.r.o.v.e','globe:g.l.o_e.b|g.l.o.b.e','close:c.l.o_e.z|c.l.o.s.e','froze:f.r.o_e.z|f.r.o.z.e',
    'cube:c.u_e.b|c.u.b.e','tube:t.u_e.b|t.u.b.e','cute:c.u_e.t|c.u.t.e','mule:m.u_e.l|m.u.l.e','rule:r.u_e.l|r.u.l.e',
    'tune:t.u_e.n|t.u.n.e','dune:d.u_e.n|d.u.n.e','june:j.u_e.n|j.u.n.e','flute:f.l.u_e.t|f.l.u.t.e','huge:h.u_e.j|h.u.g.e'
  ],
  'L2-3': [
    'car:c.ar','far:f.ar','jar:j.ar','tar:t.ar','bar:b.ar','star:s.t.ar','scar:s.c.ar',
    'card:c.ar.d','hard:h.ar.d','yard:y.ar.d','barn:b.ar.n','yarn:y.ar.n','farm:f.ar.m','harm:h.ar.m','arm:ar.m','art:ar.t',
    'cart:c.ar.t','part:p.ar.t','start:s.t.ar.t','dark:d.ar.k','park:p.ar.k','bark:b.ar.k','mark:m.ar.k',
    'shark:sh.ar.k','sharp:sh.ar.p','smart:s.m.ar.t','charm:ch.ar.m',
    'corn:c.or.n','born:b.or.n','horn:h.or.n','torn:t.or.n','worn:w.or.n','cord:c.or.d',
    'fort:f.or.t','sort:s.or.t','short:sh.or.t','sport:s.p.or.t','storm:s.t.or.m','north:n.or.th',
    'porch:p.or.ch','torch:t.or.ch','fork:f.or.k','pork:p.or.k','for:f.or','or:or'
  ],
  'L2-4': [
    'her:h.er','herd:h.er.d','fern:f.er.n','verb:v.er.b','germ:g.er.m','term:t.er.m','stern:s.t.er.n',
    'bird:b.ir.d','girl:g.ir.l','firm:f.ir.m','first:f.ir.s.t','third:th.ir.d','shirt:sh.ir.t','skirt:s.k.ir.t','dirt:d.ir.t',
    'stir:s.t.ir','swirl:s.w.ir.l','twirl:t.w.ir.l','whirl:wh.ir.l','birth:b.ir.th','sir:s.ir',
    'turn:t.ur.n','burn:b.ur.n','curl:c.ur.l','hurl:h.ur.l','surf:s.ur.f','turf:t.ur.f','hurt:h.ur.t','curb:c.ur.b',
    'fur:f.ur','blur:b.l.ur','spur:s.p.ur','nurse:n.ur.s|n.u.r.s.e','purse:p.ur.s|p.u.r.s.e','burst:b.ur.s.t','church:ch.ur.ch'
  ],
  'L2-5': [
    'rain:r.ai.n','main:m.ai.n','pain:p.ai.n','gain:g.ai.n','maid:m.ai.d','paid:p.ai.d','raid:r.ai.d',
    'tail:t.ai.l','sail:s.ai.l','mail:m.ai.l','nail:n.ai.l','pail:p.ai.l','jail:j.ai.l',
    'wait:w.ai.t','bait:b.ai.t','paint:p.ai.n.t','saint:s.ai.n.t','faint:f.ai.n.t',
    'brain:b.r.ai.n','train:t.r.ai.n','chain:ch.ai.n','plain:p.l.ai.n','snail:s.n.ai.l','trail:t.r.ai.l','braid:b.r.ai.d',
    'day:d.ay','say:s.ay','may:m.ay','way:w.ay','pay:p.ay','lay:l.ay','hay:h.ay','bay:b.ay','ray:r.ay','jay:j.ay',
    'clay:c.l.ay','play:p.l.ay','stay:s.t.ay','tray:t.r.ay','gray:g.r.ay','pray:p.r.ay','sway:s.w.ay','spray:s.p.r.ay'
  ],
  'L2-6': [
    'bee:b.ee','see:s.ee','tree:t.r.ee','free:f.r.ee','three:th.r.ee','green:g.r.ee.n','seen:s.ee.n','queen:qu.ee.n',
    'sheep:sh.ee.p','sleep:s.l.ee.p','deep:d.ee.p','keep:k.ee.p','sweep:s.w.ee.p','sweet:s.w.ee.t','feet:f.ee.t','meet:m.ee.t',
    'seed:s.ee.d','feed:f.ee.d','need:n.ee.d','weed:w.ee.d','peel:p.ee.l','feel:f.ee.l','heel:h.ee.l','wheel:wh.ee.l',
    'eat:ea.t','sea:s.ea','tea:t.ea','pea:p.ea','beach:b.ea.ch','peach:p.ea.ch','teach:t.ea.ch','reach:r.ea.ch','each:ea.ch',
    'team:t.ea.m','seam:s.ea.m','beam:b.ea.m','dream:d.r.ea.m','cream:c.r.ea.m','clean:c.l.ea.n','mean:m.ea.n','bean:b.ea.n','lean:l.ea.n',
    'leaf:l.ea.f','heap:h.ea.p','leap:l.ea.p','treat:t.r.ea.t','key:k.ey','honey:h.o.n.ey','money:m.o.n.ey','monkey:m.o.n.k.ey'
  ],
  'L2-7': [
    'boat:b.oa.t','coat:c.oa.t','goat:g.oa.t','oat:oa.t','soap:s.oa.p','road:r.oa.d','load:l.oa.d','toad:t.oa.d',
    'loaf:l.oa.f','foam:f.oa.m','roam:r.oa.m','coach:c.oa.ch','oak:oa.k','coast:c.oa.s.t','toast:t.oa.s.t',
    'snow:s.n.ow_o','show:sh.ow_o','slow:s.l.ow_o','grow:g.r.ow_o','glow:g.l.ow_o','row:r.ow_o','low:l.ow_o','mow:m.ow_o','tow:t.ow_o',
    'blow:b.l.ow_o','crow:c.r.ow_o','flow:f.l.ow_o','throw:th.r.ow_o',
    'night:n.igh.t','light:l.igh.t','right:r.igh.t','sight:s.igh.t','tight:t.igh.t','might:m.igh.t','fight:f.igh.t',
    'bright:b.r.igh.t','flight:f.l.igh.t','high:h.igh','sigh:s.igh',
    'my:m.y_i','by:b.y_i','shy:sh.y_i','fly:f.l.y_i','try:t.r.y_i','dry:d.r.y_i','cry:c.r.y_i','sky:s.k.y_i','spy:s.p.y_i','why:wh.y_i'
  ],
  'L2-8': [
    'out:ou.t','loud:l.ou.d','cloud:c.l.ou.d','proud:p.r.ou.d','sound:s.ou.n.d','round:r.ou.n.d','found:f.ou.n.d','pound:p.ou.n.d','count:c.ou.n.t',
    'mouth:m.ou.th','south:s.ou.th','house:h.ou.s|h.o.u.s.e','mouse:m.ou.s|m.o.u.s.e','ouch:ou.ch','couch:c.ou.ch','pouch:p.ou.ch',
    'cow:c.ow_ou','how:h.ow_ou','now:n.ow_ou','wow:w.ow_ou','down:d.ow_ou.n','town:t.ow_ou.n','gown:g.ow_ou.n',
    'crown:c.r.ow_ou.n','brown:b.r.ow_ou.n','clown:c.l.ow_ou.n','owl:ow_ou.l','howl:h.ow_ou.l','growl:g.r.ow_ou.l',
    'oil:oi.l','boil:b.oi.l','coil:c.oi.l','soil:s.oi.l','coin:c.oi.n','join:j.oi.n','point:p.oi.n.t','joint:j.oi.n.t',
    'toy:t.oy','boy:b.oy','joy:j.oy','soy:s.oy','moon:m.oo.n','soon:s.oo.n','noon:n.oo.n','spoon:s.p.oo.n',
    'zoo:z.oo','too:t.oo','food:f.oo.d','mood:m.oo.d','roof:r.oo.f','root:r.oo.t','boot:b.oo.t',
    'book:b.oo.k','look:l.oo.k','took:t.oo.k','cook:c.oo.k','hook:h.oo.k','foot:f.oo.t','good:g.oo.d','wood:w.oo.d','stood:s.t.oo.d'
  ],
  'L3-1': [
    'sunset:sun.set','sunrise:sun.rise','cupcake:cup.cake','pancake:pan.cake','rainbow:rain.bow','raincoat:rain.coat',
    'bedtime:bed.time','daytime:day.time','playtime:play.time','backpack:back.pack','backyard:back.yard',
    'popcorn:pop.corn','starfish:star.fish','catfish:cat.fish','inside:in.side','outside:out.side',
    'weekend:week.end','seaweed:sea.weed','bathtub:bath.tub','laptop:lap.top','cowboy:cow.boy',
    'sailboat:sail.boat','snowman:snow.man','moonlight:moon.light','daylight:day.light','anthill:ant.hill'
  ],
  'L3-2': [
    'rabbit:rab.bit','napkin:nap.kin','muffin:muf.fin','mitten:mit.ten','kitten:kit.ten','ribbon:rib.bon','robin:rob.in',
    'picnic:pic.nic','basket:bas.ket','magnet:mag.net','mascot:mas.cot','puppet:pup.pet','velvet:vel.vet',
    'insect:in.sect','index:in.dex','tennis:ten.nis','dentist:den.tist','trumpet:trum.pet','blanket:blan.ket',
    'pumpkin:pump.kin','problem:prob.lem','contest:con.test','sudden:sud.den','happen:hap.pen','helmet:hel.met','pocket:pock.et'
  ],
  'L3-3': [
    'baby:ba.by','pony:po.ny','tiny:ti.ny','lady:la.dy','navy:na.vy','paper:pa.per','tiger:ti.ger','spider:spi.der',
    'music:mu.sic','pupil:pu.pil','bonus:bo.nus','focus:fo.cus','robot:ro.bot','moment:mo.ment',
    'happy:hap.py','silly:sil.ly','funny:fun.ny','sunny:sun.ny','bunny:bun.ny','penny:pen.ny',
    'candy:can.dy','sandy:san.dy','windy:win.dy','rocky:rock.y_e','lucky:luck.y_e','puppy:pup.py',
    'kitty:kit.ty','jelly:jel.ly','belly:bel.ly','berry:ber.ry','cherry:cher.ry','story:sto.ry'
  ],
  'L3-4': [
    'little:lit.tle','middle:mid.dle','riddle:rid.dle','paddle:pad.dle','puddle:pud.dle','saddle:sad.dle',
    'bubble:bub.ble','wobble:wob.ble','giggle:gig.gle','wiggle:wig.gle','jungle:jun.gle','uncle:un.cle',
    'candle:can.dle','handle:han.dle','bundle:bun.dle','sparkle:spar.kle','twinkle:twin.kle','turtle:tur.tle',
    'purple:pur.ple','apple:ap.ple','ripple:rip.ple','simple:sim.ple','maple:ma.ple','table:ta.ble','cable:ca.ble','title:ti.tle'
  ],
  'L3-5': [
    'unhappy:un.hap.py','unlock:un.lock','unpack:un.pack','unzip:un.zip','untie:un.tie','unfair:un.fair','unkind:un.kind','unsafe:un.safe','undo:un.do',
    'redo:re.do','replay:re.play','repaint:re.paint','refill:re.fill','reread:re.read','retell:re.tell','remake:re.make','rebuild:re.build','return:re.turn',
    'preheat:pre.heat','preschool:pre.school','pretest:pre.test','preview:pre.view'
  ],
  'L3-6': [
    'joyful:joy.ful','helpful:help.ful','hopeful:hope.ful','playful:play.ful','thankful:thank.ful','colorful:col.or.ful','careful:care.ful','cheerful:cheer.ful',
    'fearless:fear.less','helpless:help.less','homeless:home.less','spotless:spot.less','harmless:harm.less','endless:end.less',
    'quickly:quick.ly','slowly:slow.ly','softly:soft.ly','loudly:loud.ly','sadly:sad.ly','gladly:glad.ly',
    'bravest:brav.est','fastest:fast.est','smallest:small.est','tallest:tall.est','sweetest:sweet.est','brightest:bright.est'
  ],
  'L3-7': [
    'ice:eye.s|i.c.e','mice:m.eye.s|m.i.c.e','rice:r.eye.s|r.i.c.e','nice:n.eye.s|n.i.c.e','race:r.a_e.s|r.a.c.e','face:f.a_e.s|f.a.c.e','lace:l.a_e.s|l.a.c.e','place:p.l.a_e.s|p.l.a.c.e','space:s.p.a_e.s|s.p.a.c.e','trace:t.r.a_e.s|t.r.a.c.e',
    'city:ci.ty','center:cen.ter','pencil:pen.cil','dance:dan.ce','chance:chan.ce','prince:prin.ce','fence:fen.ce',
    'gem:ge.m|g.e.m','age:a_e.j|a.g.e','page:p.a_e.j|p.a.g.e','cage:c.a_e.j|c.a.g.e','stage:s.t.a_e.j|s.t.a.g.e','large:l.ar.j|l.a.r.g.e','gentle:gen.tle','giant:gi.ant','magic:mag.ic',
    'knee:kn.ee','knot:kn.o.t','know:kn.ow_o','knock:kn.o.ck','knit:kn.i.t','knight:kn.igh.t',
    'wrap:wr.a.p','wrist:wr.i.s.t','write:wr.i_e.t|w.r.i.t.e','wrong:wr.o.ng','wrote:wr.o_e.t|w.r.o.t.e','wren:wr.e.n'
  ]
};

// parse helper: 'cake:c.a_e.k|c.a.k.e' → {w, sounds[], tiles[]}
function bankWord(entry) {
  const [w, rest] = entry.split(':');
  const [s, t] = rest.split('|');
  return { w, sounds: s.split('.'), tiles: (t || s).split('.') };
}
function bankFor(islandId) { return (BANKS[islandId] || []).map(bankWord); }
