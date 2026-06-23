export const HEROES = ["Fenixia","Daphne","Sera","Dragonic","Andrew","Belial","Yord","Other"]
export const SPEED_CATS = ["Speed Up","Tech Speed Up"]

export const ITEM_TYPES = [
  // Currency
  { id:"diamonds",        label:"Diamond",                           cat:"Currency",      icon:"💎", speedH:0 },
  { id:"gold_res",        label:"Gold (Resource)",                   cat:"Currency",      icon:"🪙", speedH:0 },
  { id:"energy_crystal",  label:"Energy Crystal",                    cat:"Currency",      icon:"🔮", speedH:0 },
  { id:"stamina",         label:"Stamina",                           cat:"Currency",      icon:"⚡", speedH:0 },
  // VIP
  { id:"vip_exp_500",     label:"VIP EXP 500",                       cat:"VIP",           icon:"⭐", speedH:0 },
  { id:"vip_exp_1k",      label:"VIP EXP 1,000",                     cat:"VIP",           icon:"⭐", speedH:0 },
  { id:"vip_exp_2500",    label:"VIP EXP 2,500",                     cat:"VIP",           icon:"⭐", speedH:0 },
  // Gacha
  { id:"hrv",             label:"Hero Recruitment Voucher",          cat:"Gacha",         icon:"🎫", speedH:0 },
  { id:"hdv",             label:"Hero's Descent Voucher",            cat:"Gacha",         icon:"🐉", speedH:0 },
  { id:"harv",            label:"Heavenfall Arsenal Recruit Voucher",cat:"Gacha",         icon:"🔱", speedH:0 },
  { id:"srv",             label:"Survivor Recruitment Voucher",      cat:"Gacha",         icon:"🎖️",speedH:0 },
  // Hero
  { id:"c5hsc",           label:"Common 5+ Hero Selection Card",     cat:"Hero",          icon:"📦", speedH:0 },
  { id:"excl_gear",       label:"Excl. Gear Shard (hero-specific)",  cat:"Hero",          icon:"⚔️", speedH:0, heroSpecific:true },
  { id:"univ_excl_gear",  label:"Universal Excl. Gear Shard",        cat:"Hero",          icon:"🛡️",speedH:0 },
  { id:"splus_shard",     label:"S+ Hero Universal Shard",           cat:"Hero",          icon:"🧩", speedH:0 },
  { id:"s_shard",         label:"S Hero Universal Shard",            cat:"Hero",          icon:"🟣", speedH:0 },
  { id:"a_shard",         label:"A Hero Universal Shard",            cat:"Hero",          icon:"🔵", speedH:0 },
  { id:"skill_exp",       label:"Skill EXP Book",                    cat:"Hero",          icon:"📘", speedH:0 },
  { id:"hero_exp_l",      label:"Hero EXP Chest (L) 7.2M",          cat:"Hero",          icon:"🟪", speedH:0 },
  { id:"hero_exp_s",      label:"Hero EXP Chest (S) 901K",          cat:"Hero",          icon:"🔷", speedH:0 },
  // Gear
  { id:"leg_gear_scroll",      label:"Legendary Gear Scroll",        cat:"Gear",          icon:"📜", speedH:0 },
  { id:"mythic_gear_scroll",   label:"Mythic Gear Scroll",           cat:"Gear",          icon:"📛", speedH:0 },
  { id:"gear_boost_chest",     label:"Gear Boost Selection Chest",   cat:"Gear",          icon:"🎁", speedH:0 },
  { id:"specials_key",         label:"Specials Key",                 cat:"Gear",          icon:"🗝️",speedH:0 },
  { id:"leg_gear_crystal",     label:"Legendary Gear Crystal",       cat:"Gear",          icon:"🟠", speedH:0 },
  { id:"epic_gear_crystal",    label:"Epic Gear Crystal",            cat:"Gear",          icon:"🟣", speedH:0 },
  { id:"exc_gear_crystal",     label:"Excellent Gear Crystal",       cat:"Gear",          icon:"🔵", speedH:0 },
  { id:"rare_gear_crystal",    label:"Rare Gear Crystal",            cat:"Gear",          icon:"🟢", speedH:0 },
  { id:"common_gear_crystal",  label:"Common Gear Crystal",          cat:"Gear",          icon:"⬜", speedH:0 },
  { id:"upgrade_crystal",      label:"Upgrade Crystal",              cat:"Gear",          icon:"🔷", speedH:0 },
  // Beast
  { id:"mb_exp_potion",        label:"Mystic Beast EXP Potion",      cat:"Beast",         icon:"🧬", speedH:0 },
  { id:"mb_exp_10k",           label:"Mystic Beast EXP Potion 10K",  cat:"Beast",         icon:"🧬", speedH:0 },
  { id:"mb_breakthrough",      label:"Mystic Beast Breakthrough Potion",cat:"Beast",      icon:"🧪", speedH:0 },
  { id:"mb_rankup_orb",        label:"Mystic Beast Rankup Adv. Orb", cat:"Beast",         icon:"🔮", speedH:0 },
  { id:"mb_mark_lv3_chest",    label:"Lv.3 Beast Mark Chest (random)",cat:"Beast",       icon:"📫", speedH:0 },
  { id:"mb_mark_lv5_chest",    label:"Lv.5 Beast Mark Chest (random)",cat:"Beast",       icon:"📫", speedH:0 },
  { id:"mb_mark_lv5_sel",      label:"Lv.5 Beast Mark Selection Chest",cat:"Beast",      icon:"📬", speedH:0 },
  { id:"skill_crystal_chest",  label:"Skill Crystal Chest",          cat:"Beast",         icon:"🟢", speedH:0 },
  { id:"epic_skill_crystal",   label:"Epic Skill Crystal Chest",     cat:"Beast",         icon:"🟣", speedH:0 },
  { id:"leg_skill_crystal",    label:"Legendary Skill Crystal Chest",cat:"Beast",         icon:"🟠", speedH:0 },
  { id:"common_crystal_mat",   label:"Common Crystal Material",      cat:"Beast",         icon:"🔴", speedH:0 },
  { id:"adv_crystal_mat",      label:"Advanced Crystal Material",    cat:"Beast",         icon:"🟠", speedH:0 },
  // Resources
  { id:"iron_chest",      label:"Iron Level Chest",                  cat:"Resource",      icon:"⚙️", speedH:0 },
  { id:"gold_chest",      label:"Gold Level Chest",                  cat:"Resource",      icon:"🏅", speedH:0 },
  { id:"wheat_chest",     label:"Wheat Level Chest",                 cat:"Resource",      icon:"🌾", speedH:0 },
  // Union
  { id:"union_excellent", label:"Excellent Union Gift",              cat:"Union",         icon:"🔵", speedH:0 },
  { id:"union_epic",      label:"Epic Union Gift",                   cat:"Union",         icon:"🟣", speedH:0 },
  { id:"union_legendary", label:"Legendary Union Gift",              cat:"Union",         icon:"🟡", speedH:0 },
  { id:"union_mythic",    label:"Mythic Union Gift",                 cat:"Union",         icon:"🔴", speedH:0 },
  // Season
  { id:"class_exp_10k",   label:"Class EXP 10K",                    cat:"Season",        icon:"🟣", speedH:0 },
  // Decoration
  { id:"deco_stone",      label:"Universal Decoration Stone",        cat:"Decoration",    icon:"💠", speedH:0 },
  { id:"deco_orange",     label:"Orange Decoration Chest",           cat:"Decoration",    icon:"🟠", speedH:0 },
  // Speed Up
  { id:"su_5m",   label:"Speed Up 5min",       cat:"Speed Up",      icon:"⏩", speedH:5/60 },
  { id:"su_1h",   label:"Speed Up 1h",         cat:"Speed Up",      icon:"⏩", speedH:1 },
  { id:"su_3h",   label:"Speed Up 3h",         cat:"Speed Up",      icon:"⏩", speedH:3 },
  { id:"su_8h",   label:"Speed Up 8h",         cat:"Speed Up",      icon:"⏩", speedH:8 },
  { id:"su_24h",  label:"Speed Up 24h",        cat:"Speed Up",      icon:"⏩", speedH:24 },
  // Tech Speed Up
  { id:"tsu_5m",  label:"Tech Speed Up 5min",  cat:"Tech Speed Up", icon:"🔬", speedH:5/60 },
  { id:"tsu_1h",  label:"Tech Speed Up 1h",    cat:"Tech Speed Up", icon:"🔬", speedH:1 },
  { id:"tsu_3h",  label:"Tech Speed Up 3h",    cat:"Tech Speed Up", icon:"🔬", speedH:3 },
  { id:"tsu_8h",  label:"Tech Speed Up 8h",    cat:"Tech Speed Up", icon:"🔬", speedH:8 },
  { id:"tsu_24h", label:"Tech Speed Up 24h",   cat:"Tech Speed Up", icon:"🔬", speedH:24 },
  { id:"other",   label:"Other",               cat:"Other",         icon:"📌", speedH:0 },
]

export const ITEM_MAP = Object.fromEntries(ITEM_TYPES.map(t => [t.id, t]))
export const ITEM_CATS = [...new Set(ITEM_TYPES.map(t => t.cat))]
export const PKG_TAGS = ["Daily Special","Daily Must-Buy","Weekly","Flash Deal","Battle Pass","Monthly","Event","Starter","VIP","Bundle","Other"]

export const DEFAULT_BASELINES = [
  { name:"Daily Gear Enhancement Pack I",    price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"gear_boost_chest",qty:1},{typeId:"upgrade_crystal",qty:1000},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Energy Crystal Pack I",      price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"energy_crystal",qty:50},{typeId:"tsu_5m",qty:60},{typeId:"iron_chest",qty:1},{typeId:"gold_chest",qty:4},{typeId:"vip_exp_500",qty:1}]},
  { name:"Daily Mark Pack I",                price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"mb_mark_lv3_chest",qty:3},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Mystic Beast Potion Pack I", price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"mb_breakthrough",qty:20},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Divine Beast Crystal Gift Pack I", price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"leg_skill_crystal",qty:1},{typeId:"skill_crystal_chest",qty:3},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Decorative Origem Pack I",   price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"deco_stone",qty:1},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Speed Up Pack I",            price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"su_5m",qty:180},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Hero Training Pack I",       price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:500},{typeId:"hrv",qty:5},{typeId:"splus_shard",qty:1000},{typeId:"skill_exp",qty:1200},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Wheat Pack I",               price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"wheat_chest",qty:8},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Iron Pack I",                price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"iron_chest",qty:8},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Daily Value Gold Pack I",          price:4.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"gold_chest",qty:8},{typeId:"vip_exp_500",qty:1},{typeId:"hero_exp_s",qty:1}]},
  // Weekly
  { name:"Energy Crystal Pack (Weekly)",     price:99.99,currency:"USD", items:[{typeId:"diamonds",qty:10000},{typeId:"energy_crystal",qty:1000},{typeId:"tsu_5m",qty:1200},{typeId:"iron_chest",qty:20},{typeId:"gold_chest",qty:80},{typeId:"wheat_chest",qty:20},{typeId:"vip_exp_2500",qty:4},{typeId:"union_mythic",qty:1}]},
  { name:"Class EXP Pack (Weekly)",          price:9.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"mb_exp_10k",qty:10},{typeId:"vip_exp_1k",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Castle Resource Pack (Weekly)",    price:19.99,currency:"USD", items:[{typeId:"diamonds",qty:2000},{typeId:"iron_chest",qty:12},{typeId:"gold_chest",qty:12},{typeId:"wheat_chest",qty:12},{typeId:"su_5m",qty:180},{typeId:"vip_exp_1k",qty:2},{typeId:"leg_skill_crystal",qty:1}]},
  { name:"Value Stamina Pack (Weekly)",      price:9.99, currency:"USD", items:[{typeId:"diamonds",qty:1000},{typeId:"stamina",qty:10},{typeId:"su_5m",qty:200},{typeId:"vip_exp_1k",qty:1},{typeId:"hero_exp_s",qty:1}]},
  { name:"Power Surge Pack (Weekly)",        price:99.99,currency:"USD", items:[{typeId:"diamonds",qty:10000},{typeId:"splus_shard",qty:25000},{typeId:"skill_exp",qty:25000},{typeId:"hrv",qty:40},{typeId:"vip_exp_2500",qty:4},{typeId:"union_mythic",qty:1}]},
  { name:"Mystic Beast Mark Pack (Weekly)",  price:49.99,currency:"USD", items:[{typeId:"diamonds",qty:5000},{typeId:"mb_mark_lv5_sel",qty:1},{typeId:"mb_mark_lv5_chest",qty:1},{typeId:"mb_mark_lv3_chest",qty:3},{typeId:"vip_exp_2500",qty:2},{typeId:"leg_skill_crystal",qty:1}]},
  { name:"Mystic Beast Potion Pack (Weekly)",price:49.99,currency:"USD", items:[{typeId:"diamonds",qty:5000},{typeId:"mb_breakthrough",qty:150},{typeId:"mb_exp_10k",qty:40},{typeId:"vip_exp_2500",qty:2},{typeId:"leg_gear_crystal",qty:1}]},
  { name:"Weekly Crystal Gift Pack",         price:49.99,currency:"USD", items:[{typeId:"diamonds",qty:5000},{typeId:"leg_skill_crystal",qty:1},{typeId:"epic_skill_crystal",qty:4},{typeId:"skill_crystal_chest",qty:20},{typeId:"vip_exp_2500",qty:2},{typeId:"leg_gear_crystal",qty:1}]},
  { name:"Decorative Origem Pack (Weekly)",  price:99.99,currency:"USD", items:[{typeId:"diamonds",qty:10000},{typeId:"deco_stone",qty:1100},{typeId:"deco_orange",qty:1},{typeId:"vip_exp_2500",qty:4},{typeId:"union_mythic",qty:1}]},
  { name:"Value Gear Pack (Weekly)",         price:49.99,currency:"USD", items:[{typeId:"diamonds",qty:5000},{typeId:"upgrade_crystal",qty:750},{typeId:"su_5m",qty:600},{typeId:"gold_res",qty:2},{typeId:"vip_exp_2500",qty:2},{typeId:"leg_gear_crystal",qty:1}]},
  { name:"Weekly Hero Training Pack",        price:99.99,currency:"USD", items:[{typeId:"diamonds",qty:5000},{typeId:"splus_shard",qty:75},{typeId:"vip_exp_2500",qty:4},{typeId:"union_mythic",qty:1}]},
  { name:"Universal Excl. Gear Shard Pack",  price:99.99,currency:"USD", items:[{typeId:"diamonds",qty:10000},{typeId:"univ_excl_gear",qty:80},{typeId:"vip_exp_2500",qty:4},{typeId:"union_mythic",qty:1}]},
]
