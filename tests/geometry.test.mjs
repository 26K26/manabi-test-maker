import test from 'node:test';
import assert from 'node:assert/strict';
import {triangle,validateGroups,tickLines,length} from '../src/geometry.mjs';
import {seed,valid,score} from '../src/model.mjs';
test('one mark for AB=AC; two marks for BD=DC; AD unmarked',()=>{
 assert.deepEqual(validateGroups(triangle),[]);
 assert.deepEqual(triangle.equalGroups.map(g=>g.ticks),[1,2]);
 assert.notEqual(length(triangle.points,['A','B']),length(triangle.points,['B','D']));
 assert.equal(triangle.equalGroups.flatMap(g=>g.edges).some(e=>e.includes('A')&&e.includes('D')),false);
});
test('reject reused equality marks',()=>{const bad=structuredClone(triangle);bad.equalGroups[1].ticks=1;assert.ok(validateGroups(bad).length);});
test('marks are perpendicular and centered',()=>{const t=tickLines([0,0],[20,0],2);assert.equal(t.length,2);assert.equal(t[0][0],t[0][2]);assert.equal((t[0][0]+t[1][0])/2,10);});
test('initial document and score',()=>{const s=seed();assert.ok(valid(s));assert.deepEqual(score(s.blocks),{count:2,total:9,knowledge:3,thinking:6});});
