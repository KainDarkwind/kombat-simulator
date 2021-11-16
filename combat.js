const noArmor = {
   description: "nothing",
   damageReduction: 0,
   armorClass: 5,
   apRegen: 0,
};
const leather = {
   description: "leather armor",
   damageReduction: 0,
   armorClass: 12,
   apRegen: 1,
};

const chainmail = {
   description: "chainmail armor",
   damageReduction: 1,
   armorClass: 9,
   apRegen: 0,
};
const platemail = {
   description: "platemail armor",
   damageReduction: 2,
   armorClass: 6,
   apRegen: -1,
};

const dagger = {
   description: "dagger",
   attack: 0,
   damageMin: 1,
   damageMax: 4,
   apCost: -1,
   backstab: 2,
};

const sword = {
   description: "sword",
   attack: 1,
   damageMin: 1,
   damageMax: 8,
   apCost: 0,
   backstab: 0,
};

const axe = {
   description: "axe",
   attack: 0,
   damageMin: 1,
   damageMax: 12,
   apCost: 1,
   backstab: 0,
};

const goblin = {
   name: "Goblin",
   level: 1,
   image: "goblin2.jpg",
   hitDie: 6,
   maxHp: 6,
   armor: noArmor,
   attack: 2,
   weapon: axe,
   strength: -1,
   dexterity: 1,
   endurance: -1,
   mind: -1,
   agility: 1,
   spirit: -1,
};

const hero = {
   name: "Hero",
   level: 1,
   image: "hero-female.jpg",
   hitDie: 10,
   maxHp: 10,
   armor: chainmail,
   attack: 2,
   weapon: sword,
   strength: 2,
   dexterity: 2,
   endurance: 4,
   mind: 1,
   agility: 2,
   spirit: 3,
};

const goblinMaxHitPoints = getHitPoints(goblin);
let goblinCurrentHitPoints = goblinMaxHitPoints;
const heroMaxHitPoints = getHitPoints(hero);
let heroCurrentHitPoints = heroMaxHitPoints;

$(`#goblin-hit-points`).html(`${goblinCurrentHitPoints}/${goblinMaxHitPoints}`);
$(`#goblin-level`).html(goblin.level);
$(`#goblin-armor-class`).html(goblin.armor.armorClass + hero.agility);
$(`#goblin-weapon`).html(goblin.weapon.description);
$(`#goblin-armor`).html(goblin.armor.description);
$(`#goblin-strength`).html(goblin.strength);
$(`#goblin-dexterity`).html(goblin.dexterity);
$(`#goblin-endurance`).html(goblin.endurance);
$(`#goblin-mind`).html(goblin.mind);
$(`#goblin-agility`).html(goblin.agility);
$(`#goblin-spirit`).html(goblin.spirit);

$(`#hero-armor-class`).html(hero.armor.armorClass + hero.agility);
$(`#hero-hit-points`).html(`${heroCurrentHitPoints}/${heroMaxHitPoints}`);
$(`#hero-level`).html(hero.level);
$(`#hero-weapon`).html(hero.weapon.description);
$(`#hero-armor`).html(hero.armor.description);
$(`#hero-strength`).html(hero.strength);
$(`#hero-dexterity`).html(hero.dexterity);
$(`#hero-endurance`).html(hero.endurance);
$(`#hero-mind`).html(hero.mind);
$(`#hero-agility`).html(hero.agility);
$(`#hero-spirit`).html(hero.spirit);

const stab = {
   description: "stabs",
   damage: 0,
   apCost: 2,
};

const slash = {
   description: "slashes",
   damage: 1,
   apCost: 3,
};

$("#stab-button-goblin").click(function (e) {
   rollCombat(goblin, hero, slash);
   rollCombat(hero, goblin, stab);
});

$("#slash-button-goblin").click(function (e) {
   rollCombat(goblin, hero, slash);
   rollCombat(hero, goblin, slash);
});

$("#defend-button-goblin").click(function (e) {
   const heroDef = rollDefense(hero);
   rollCombat(goblin, heroDef, slash);
});

function rollDefense(char) {
   const defendingChar = deepCopy(char);
   defendingChar.endurance = char.endurance + 2;
   defendingChar.agility = char.agility + 2;
   console.log("He's defending!", defendingChar.name);
   return defendingChar;
}

function rollCombat(attacker, target, attackType) {
   let attackerAttack = attackRoll(attacker);
   const targetArmorClass = getArmorClass(target);
   console.log("The armor class targeted is:", targetArmorClass);
   console.log(attacker.name, "hits AC:", attackerAttack);

   if (attackerAttack >= targetArmorClass) {
      let attackerDamage =
         getDamage(attacker, attackType) - getDamageReduction(target);
      console.log(
         attacker.name,
         attackType.description,
         attackerDamage,
         target.name,
         "DR:",
         target.armor.damageReduction
      );

      let targetCurrentHitPoints = target.maxHp;
      targetCurrentHitPoints = targetCurrentHitPoints - attackerDamage;

      showCombatReadout(
         "#combat-readout-goblin",
         getCombatMessage(attacker.name, attackerDamage, attackType)
      );
   } else {
      showCombatReadout(
         "#combat-readout-goblin",
         getCombatMessage(attacker.name, 0, attackType)
      );
   }
}

function attackRoll(character) {
   const rolledResult = getRandomInt(1, 20);
   const attack = getAttack(character);
   const weaponBonus = character.weapon.attack;
   console.log(character.name, "rolled", rolledResult);
   console.log(character.name, "adds", attack + weaponBonus);
   return rolledResult + attack + weaponBonus;
}

function getArmorClass(character) {
   return character.armor.armorClass + character.agility;
}

function getDamage(character, attack) {
   let weaponDamage = getRandomInt(
      character.weapon.damageMin,
      character.weapon.damageMax
   );
   console.log("The random damage from the weapon is", weaponDamage);
   let charDamage = character.strength;
   console.log("The char's damage", charDamage);
   let attackDamage = attack.damage;
   console.log("The attack in question's bonus damage", attackDamage);
   let backstabDamage = checkBackstab(attack, character.weapon.backstab);
   console.log(
      "After we check the backstab this is its bonus damage:",
      backstabDamage
   );
   // if (attack.description === "stabs") {
   //    console.log("He stabbed so we'll check for backstab!");
   //    const backstab = checkBackstab(character.weapon.backstab);
   //    if (backstab === true) {
   //       console.log("We successfully backstabbed");
   //       return (backstabDamage = 10);
   //    } else {
   //       console.log("We failed to backstab");
   //       return (backstabDamage = 0);
   //    }
   // }

   const totalDamage =
      weaponDamage + charDamage + attackDamage + backstabDamage;
   console.log(
      "The total damage is going to be",
      weaponDamage,
      "+",
      charDamage,
      "+",
      attackDamage,
      "+",
      backstabDamage,
      "=",
      totalDamage
   );
   return totalDamage;
}

function checkBackstab(attackType, weaponValue) {
   if (attackType !== stab) {
      console.log("Not a stab so no backstab chance");
      return 0;
   } else {
      const backstabChance = getRandomInt(1, 10);
      console.log("There's a chance", backstabChance);
      if (backstabChance + weaponValue >= 10) {
         console.log("It's a backstab");
         return 10;
      } else {
         console.log("Not a backstab");
         return 0;
      }
   }
}

function getDamageReduction(character) {
   return character.endurance + character.armor.damageReduction;
}

function getAttack(character) {
   charLevel = character.level;
   charDexterity = character.dexterity;
   return charLevel + charDexterity;
}

function showCombatReadout(element, combatMessage) {
   $(`${element}`).append(combatMessage);
}

function getCombatMessage(char, val, attackType) {
   if (val !== 0) {
      return `<p>${char} ${attackType.description} for ${val} damage. </p>`;
   } else {
      return `<p>${char} misses.</p>`;
   }
}

function getHitPoints(character) {
   hitPointsFromHitDie =
      getRandomInt(1, character.hitDie) + character.endurance;
   totalHitPoints = character.level * hitPointsFromHitDie;
   return totalHitPoints;
}

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max + 1 - min) + min); //max is normally exclusive, min is inclusive, so +1 allows you to include the max.
}
