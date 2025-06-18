# Code Review: Optmizations & Anti-Pattern Fixes

Original version of WalletPage works, but it has a number of areas where we can make it faster, clearer, more reliable. Here’s the nitty gritty of what I found and how I fixed everything:

## 1. Redundant Function Creation

getPriority() was a function defined inside the component so it gets created every time there's a render. It’s harmless for now, but a potential performance problem & bug if this function is a dependency. I pulled it out of the component so it is only defined once.

## 2. Undeclared Variable Bug

lhsPriority was alluded to in the filter logic, but not defined. That would be a run time error. I fixed it by switch it to balancePriority which I suppose was the intended one.

## 3. Extraneous Dependencies in useMemo

The sorting logic used memoization: [balances, prices] But it used only balances. Unnecessary dependencies will re-render unnecessarily, things you could have otherwise prevented because prices can and will change! I removed prices from the

## 4. Multiple.map() Loops

sortedBalances. map() was also used twice, both for pretty accounting formatting and to display the rows. That’s two passes over the same data. I combined the two into one. map() loop and to keep it light.

## 5. Keys Based on Index

Items from the list were keyed by index; this is usually a mistake unless you’re certain the order of the items will never change. I replaced it with balance. currency, which is a stable, distinctive identification in

## 6. Missing Default States

Undefined values from useWalletBalances() or usePrices() there is no guard against. I added fallbacks ([] and {}) just so the component doesn’t crash of the hooks return undefined in loading or network problems scenarios.

## 7. Missing Memoization for Rows

The rows variable had zero memoization (there was none), so it’s re-computed every time render is called, not just when the data actually changed. I wrapped it in useMemo with clean dependencies.

## 8. Where is BoxProps come from?

We have interface Props extends BoxProps without adding other properties. We can shorten it as follows React.FC<BoxProps> = (props) => {...}. I will give an example with
using BoxProps in MUI. Because BoxProps (from MUI) includes properties like ref, sx, border,... that are only compatible with MUI components like Box, not pure HTML tags
like <div>