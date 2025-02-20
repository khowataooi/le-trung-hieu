/*
 * Task:
 * Provide 3 unique implementations of the following function in JavaScript.
 * **Input**: `n` - any integer
 * *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.
 * **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
 */

//Note: Assuming n is always positive

// 1. Using basic for loop
var sum_to_n_a = function (n) {
  let result = 0
  for (let i = 0; i <= n; i++) {
    result += i
  }
  return result
}

// 2. Using recursion
var sum_to_n_b = function (n) {
  if (n <= 1) return n
  return n + sum_to_n_b(n - 1)
}

// 3. Using mathematical formula
var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2
}
