
export const HXHConfig = {
  XP_LEVELS: [
    { level: 1, xp: 0 }, { level: 2, xp: 100 }, { level: 3, xp: 300 },
    { level: 4, xp: 600 }, { level: 5, xp: 1000 }, { level: 6, xp: 1500 },
    { level: 7, xp: 2100 }, { level: 8, xp: 2800 }, { level: 9, xp: 3600 },
    { level: 10, xp: 4500 }
  ],
  EXPERTICIA_HITOS: [4,8,12,16,20],
  BONUS_TABLE: [
    -2, -1,-1, 0,0, 1,1, 2,2, 3,3, 4,4, 5,5, 6,6,6, 7,7,7, 8,8,8, 9,9,9,
    10,10,10, 11,11,11, 12,12,12, 13,13,13, 14,14,14, 15,15,15
  ],
  ORIGINS: {
    "Nacionalidad": {
      "Padokea":   { attr:{fue:+1, des:+0, con:+1, per:+0, int:+0, car:+0}, skills:{}, discs:{} },
      "Meteor":    { attr:{fue:+0, des:+1, con:+0, per:+1, int:+0, car:-1}, skills:{}, discs:{} },
      "Kakin":     { attr:{fue:-1, des:+0, con:+0, per:+0, int:+1, car:+1}, skills:{}, discs:{} }
    },
    "Formación": {
      "Autodidacta": { attr:{fue:+0, des:+0, con:+0, per:+0, int:+1, car:+0}, skills:{investigacion:+1}, discs:{} },
      "Academia":    { attr:{fue:+0, des:+0, con:+0, per:+0, int:+1, car:+1}, skills:{}, discs:{} },
      "Guerrera":    { attr:{fue:+1, des:+1, con:+0, per:+0, int:+0, car:+0}, skills:{atletismo:+1}, discs:{} }
    }
  }
};
