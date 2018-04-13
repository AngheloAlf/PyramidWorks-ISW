#Weiner Motion, i = n+1, with n the numbers of slices, and j is quantifier who starts from 0.
# z_norm_vector is a vector of random values who follows the N(0, deltaT) distribution.
W <- function(i, j, z_norm_vector, vectorResult){
    if (j == 0){
        vectorResult <- c(vectorResult, 0);
        return(W(i, j+1, z_norm_vector, vectorResult));
    }
    if (j == i){
        return(vectorResult);
    }
    W_sig <- vectorResult[j] + z_norm_vector[j];
    vectorResult <- c(vectorResult, W_sig);
    return(W(i, j+1, z_norm_vector, vectorResult));
}
#Weiner Motion super compact
Weiner <- function (z_norm_vector){
    return(c(0, cumsum(z_norm_vector)));
}
#delta Weiner Motion, j starts from 0
deltaW <- function(j, weinerMotion){
    return(weinerMotion[j+2] - weinerMotion[j+1]);
}

#jumps of time is produced by quantification
timeJumps <- function(n, T){
    deltaT = T/n;
    t = 0;
    timeArr = c(0);
    for(i in 1:n){
        t = t + deltaT;
        timeArr = c(timeArr, t);
    }
    return(timeArr);
}

#Simulation of stock X at time t_j, with t_j in timeJumps. i starts from 0.
X_t <- function(r, volatility, X_0, j, i, deltaT, weinerMotion, vectorResult){
    if (j == 0){
        return(c(X_0));
    }
    if(j == i){
        return(vectorResult);
    }
    X_sig <- r*X_0*deltaT + volatility*X_0*deltaW(i, weinerMotion) + X_0;
    return(X_t(r, volatility, X_sig, j, i+1, deltaT, weinerMotion, c(vectorResult, X_sig)));
}
#Simulate can simulate only one time, the motion of a stock at current value X, with time T.
#Ex: Simulate(0.2, 0.4, runif(1, -1e+5, 1e+5), 1, 100, 1)
Simulate <- function(r, volatility, seed, T, n, X){
    result <- c();
    deltaT = T/n;
    set.seed(seed);
    z_norm_vector <- rnorm(n, 0, deltaT);
    wienerproccess <- Weiner(z_norm_vector)#W(n+1, 0, z_norm_vector, c());
    timejumps <- timeJumps(n, T);
    stockPrices <- X_t(r, volatility, X, n, 0, deltaT, wienerproccess, c(X))
    return(cbind(timejumps, stockPrices))
    
}
# deltaW <- function (T, t, n, i, z_norm_arr){
#     deltaT <- T/n
#     t_sig <- t + deltaT
#     }
#     return(deltaW(T, t_sig, n, i-1))
#
# }