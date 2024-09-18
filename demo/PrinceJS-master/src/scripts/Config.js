export const SCALE_FACTOR = 2;
export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 200;
export const WORLD_WIDTH = SCREEN_WIDTH * SCALE_FACTOR;
export const WORLD_HEIGHT = SCREEN_HEIGHT * SCALE_FACTOR;
export const BLOCK_WIDTH = 32;
export const BLOCK_HEIGHT = 63;
export const ROOM_HEIGHT = BLOCK_HEIGHT * 3;
export const ROOM_WIDTH = SCREEN_WIDTH;
export const UI_HEIGHT = 8;
export const SKIP_TITLE = false;
export const SKIP_CUTSCENES = false;
export const KID_INMORTAL = false;



export const SERVER_URL = 'http://localhost:3000/records'
//export const SERVER_URL = 'https://lrs.adlnet.gov/xapi/statements'
export const ACTOR_NAME = 'Super Mario'
export const ACTOR_MAIL = 'student1@example.com'
export const GAME_TOKEN_POP = 'cEPTx-GsXov-dJBXe-pY7jc-NPyQ9'
// let headers = {
//     "Content-Type": "application/json",
//     "Authorization": `Basic ${btoa('xapi-tools:xapi-tools')}`, // Si usas autenticación básica
//     "X-Experience-API-Version": "1.0.3", // Necesario para xAPI
// };
// export const GAME_TOKEN_POP = headers;