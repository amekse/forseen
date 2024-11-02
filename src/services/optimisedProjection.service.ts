/*
TODO: 
1. add budget as a separate list for each month
2. from gen proj list each month substract budget for each month and store the extras
3. now we check from start budget list/month till n'th given, how much can be adjusted from extra amount
4. after adjustment if extra remains 
4A. if no extra months are given with budget we keep adding each new month with budget as average from previous budget list and adjust the extra amount there
4B. if extra months given with budget we adjust there
5. next we search for the costliest / least priority item in the expenses list and put them to delay list
6. check if extra amount crosses total amount from delay list, we search for the next priority/costlier item and add that to delay
7. check the delay list for delay dates and show user
*/