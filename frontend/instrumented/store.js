function cov_1igkcflvma() {
  var path = "C:\\Users\\sabat\\IdeaProjects\\PULSeBS_12\\frontend\\src\\store.js";
  var hash = "f098f354dd303820b63c32ec4b589884cc5c44db";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\sabat\\IdeaProjects\\PULSeBS_12\\frontend\\src\\store.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 20
        },
        end: {
          line: 7,
          column: 2
        }
      },
      "1": {
        start: {
          line: 9,
          column: 21
        },
        end: {
          line: 11,
          column: 2
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "f098f354dd303820b63c32ec4b589884cc5c44db"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1igkcflvma = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1igkcflvma();
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'; // Reduce store, implemented but not used, we don't have any diffictul state to manage for now

const rootReducer = (cov_1igkcflvma().s[0]++, combineReducers({// todos: todosReduce,
}));
export const store = (cov_1igkcflvma().s[1]++, configureStore({
  reducer: rootReducer
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JlLmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyZVN0b3JlIiwiY29tYmluZVJlZHVjZXJzIiwicm9vdFJlZHVjZXIiLCJzdG9yZSIsInJlZHVjZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixTQUFTQSxjQUFULFFBQStCLGtCQUEvQjtBQUNBLFNBQVNDLGVBQVQsUUFBZ0MsT0FBaEMsQyxDQUVBOztBQUNBLE1BQU1DLFdBQVcsNkJBQUdELGVBQWUsQ0FBQyxDQUNoQztBQURnQyxDQUFELENBQWxCLENBQWpCO0FBSUEsT0FBTyxNQUFNRSxLQUFLLDZCQUFHSCxjQUFjLENBQUM7QUFDaENJLEVBQUFBLE9BQU8sRUFBRUY7QUFEdUIsQ0FBRCxDQUFqQixDQUFYIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlndXJlU3RvcmUgfSBmcm9tICdAcmVkdXhqcy90b29sa2l0J1xyXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcclxuXHJcbi8vIFJlZHVjZSBzdG9yZSwgaW1wbGVtZW50ZWQgYnV0IG5vdCB1c2VkLCB3ZSBkb24ndCBoYXZlIGFueSBkaWZmaWN0dWwgc3RhdGUgdG8gbWFuYWdlIGZvciBub3dcclxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgLy8gdG9kb3M6IHRvZG9zUmVkdWNlLFxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoe1xyXG4gICAgcmVkdWNlcjogcm9vdFJlZHVjZXIsXHJcbn0pIl19