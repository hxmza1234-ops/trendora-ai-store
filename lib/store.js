import { demoProducts } from './demo';
let memory={products:demoProducts,updatedAt:null,refreshes:0};
export async function getState(){return memory}
export async function saveProducts(products){memory={products,updatedAt:new Date().toISOString(),refreshes:memory.refreshes+1};return memory}
