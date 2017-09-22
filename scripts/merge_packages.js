#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

/*const MODULE_ROOT = path.resolve('..')
const MODULE_NAME = path.basename(MODULE_ROOT)*/

function readFile ( filename, options ) {
  return new Promise((resolve,reject)=>{
    fs.readFile ( filename, options, (error, result)=>{
      if ( error ) {
        reject ( error )
      } else {
        resolve ( result )
      }
    } )
  })
}

function writeFile ( filename, content, options ) {
  return new Promise((resolve,reject)=>{
    fs.writeFile ( filename, content, options, (error)=>{
      if ( error ) {
        reject ( error )
      } else {
        resolve ( path.resolve(filename) )
      }
    } )
  })
}

function readJSON ( filename ) {
  return readFile ( filename, 'utf8' )
    .then ( JSON.parse )
    .catch ( error => {
      console.error( 'Failed to read file "' + filename + '" as JSON.' )
    } )
}

function testDir ( dirname ) {
  return new Promise((resolve,reject)=>{
    fs.stat(dirname,(error,stat)=>{
      if ( error ) {
        resolve ( false )
      } else {
        resolve ( stat.isDirectory() )
      }
    })
  })
}


const MODULE_SOURCE = path.resolve(process.argv[2])
const MODULE_TARGET = path.resolve(process.argv[3])

console.log('MODULE_SOURCE',MODULE_SOURCE)
console.log('MODULE_TARGET',MODULE_TARGET)

const packageSource = path.join (MODULE_SOURCE, 'package.json')
const packageTarget = path.join (MODULE_TARGET, 'package.json')

Promise.all([
    testDir(MODULE_SOURCE),
    testDir(MODULE_TARGET)
  ]).then ( results => {
    const idx = results.findIndex ( r => !r )
    if ( idx > -1 ) {
      return Promise.reject ( Error ( 'Item at ' + idx + ' is not a directory.' ) )
    }
    return readJSON ( packageTarget )
      .then ( packageModule1 => {
        return readJSON ( packageSource )
          .then ( packageModule0 => {
            return Object.assign (packageModule1, packageModule0)
          } )
      } )
  } )
  .then ( result => {
    console.log('merged: ', result)
    return writeFile(packageTarget,JSON.stringify(result,null,'  '))
  } )
  .catch ( error => {
    console.error ( error )
  } )