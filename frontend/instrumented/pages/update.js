function cov_7jv6n5lkb() {
  var path = "C:\\Users\\sabat\\IdeaProjects\\PULSeBS_12\\frontend\\src\\pages\\update.js";
  var hash = "f53135a94f52ee2017833c54dfe6d2e139219248";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\sabat\\IdeaProjects\\PULSeBS_12\\frontend\\src\\pages\\update.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 17
        },
        end: {
          line: 4,
          column: 19
        }
      },
      "1": {
        start: {
          line: 5,
          column: 8
        },
        end: {
          line: 13,
          column: 17
        }
      },
      "2": {
        start: {
          line: 7,
          column: 17
        },
        end: {
          line: 7,
          column: 39
        }
      },
      "3": {
        start: {
          line: 8,
          column: 17
        },
        end: {
          line: 8,
          column: 36
        }
      },
      "4": {
        start: {
          line: 9,
          column: 17
        },
        end: {
          line: 9,
          column: 38
        }
      },
      "5": {
        start: {
          line: 10,
          column: 17
        },
        end: {
          line: 10,
          column: 60
        }
      },
      "6": {
        start: {
          line: 12,
          column: 17
        },
        end: {
          line: 12,
          column: 34
        }
      }
    },
    fnMap: {
      "0": {
        name: "update",
        decl: {
          start: {
            line: 3,
            column: 10
          },
          end: {
            line: 3,
            column: 16
          }
        },
        loc: {
          start: {
            line: 3,
            column: 28
          },
          end: {
            line: 14,
            column: 2
          }
        },
        line: 3
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 6,
            column: 19
          },
          end: {
            line: 6,
            column: 20
          }
        },
        loc: {
          start: {
            line: 6,
            column: 26
          },
          end: {
            line: 11,
            column: 14
          }
        },
        line: 6
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 11,
            column: 22
          },
          end: {
            line: 11,
            column: 23
          }
        },
        loc: {
          start: {
            line: 11,
            column: 27
          },
          end: {
            line: 13,
            column: 15
          }
        },
        line: 11
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "f53135a94f52ee2017833c54dfe6d2e139219248"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_7jv6n5lkb = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_7jv6n5lkb();
import { getLectures } from '../api/api';

function update(component) {
  cov_7jv6n5lkb().f[0]++;
  let lecList = (cov_7jv6n5lkb().s[0]++, []);
  cov_7jv6n5lkb().s[1]++;
  getLectures().then(res => {
    cov_7jv6n5lkb().f[1]++;
    cov_7jv6n5lkb().s[2]++;
    console.log(res.data);
    cov_7jv6n5lkb().s[3]++;
    lecList = res.data;
    cov_7jv6n5lkb().s[4]++;
    console.log(lecList);
    cov_7jv6n5lkb().s[5]++;
    component.setState({
      tableData: lecList
    });
  }).catch(err => {
    cov_7jv6n5lkb().f[2]++;
    cov_7jv6n5lkb().s[6]++;
    console.log(err);
  });
}

export default update;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwZGF0ZS5qcyJdLCJuYW1lcyI6WyJnZXRMZWN0dXJlcyIsInVwZGF0ZSIsImNvbXBvbmVudCIsImxlY0xpc3QiLCJ0aGVuIiwicmVzIiwiY29uc29sZSIsImxvZyIsImRhdGEiLCJzZXRTdGF0ZSIsInRhYmxlRGF0YSIsImNhdGNoIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlWTs7Ozs7Ozs7O0FBZlgsU0FBU0EsV0FBVCxRQUE0QixZQUE1Qjs7QUFFQSxTQUFTQyxNQUFULENBQWdCQyxTQUFoQixFQUEyQjtBQUFBO0FBQ3pCLE1BQUlDLE9BQU8sNEJBQUcsRUFBSCxDQUFYO0FBRHlCO0FBRXBCSCxFQUFBQSxXQUFXLEdBQ0xJLElBRE4sQ0FDV0MsR0FBRyxJQUFJO0FBQUE7QUFBQTtBQUNUQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsR0FBRyxDQUFDRyxJQUFoQjtBQURTO0FBRVRMLElBQUFBLE9BQU8sR0FBR0UsR0FBRyxDQUFDRyxJQUFkO0FBRlM7QUFHVEYsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLE9BQVo7QUFIUztBQUlURCxJQUFBQSxTQUFTLENBQUNPLFFBQVYsQ0FBbUI7QUFBRUMsTUFBQUEsU0FBUyxFQUFFUDtBQUFiLEtBQW5CO0FBQ0gsR0FOTixFQU1RUSxLQU5SLENBTWNDLEdBQUcsSUFBRTtBQUFBO0FBQUE7QUFDVk4sSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlLLEdBQVo7QUFDRixHQVJQO0FBU047O0FBRUQsZUFBZVgsTUFBZiIsInNvdXJjZXNDb250ZW50IjpbIiBpbXBvcnQgeyBnZXRMZWN0dXJlcyB9IGZyb20gJy4uL2FwaS9hcGknXHJcblxyXG4gZnVuY3Rpb24gdXBkYXRlKGNvbXBvbmVudCkge1xyXG4gICBsZXQgbGVjTGlzdCA9IFtdO1xyXG4gICAgICAgIGdldExlY3R1cmVzKClcclxuICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgIGxlY0xpc3QgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsZWNMaXN0KTtcclxuICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyB0YWJsZURhdGE6IGxlY0xpc3QgfSk7XHJcbiAgICAgICAgICAgICB9KS5jYXRjaChlcnI9PnsgXHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICB9KTtcclxuIH1cclxuXHJcbiBleHBvcnQgZGVmYXVsdCB1cGRhdGU7Il19