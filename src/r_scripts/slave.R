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

#Simulation of stock X. i starts from 0.
X <- function(r, volatility, X_0, j, i, deltaT, weinerMotion, vectorResult){
    if (j == 0){
        return(c(X_0));
    }
    if(j == i){
        return(vectorResult);
    }
    X_sig <- r*X_0*deltaT + volatility*X_0*deltaW(i, weinerMotion) + X_0;
    return(X(r, volatility, X_sig, j, i+1, deltaT, weinerMotion, c(vectorResult, X_sig)));
}

#Simulation of stock X at time t_j, with t_j in timeJumps. i starts from 0. return only final value of X
X_t <- function(r, volatility, X_0, j, i, deltaT, weinerMotion){
    if (j == 0 || j == i){
        return(X_0);
    }
    X_sig <- r*X_0*deltaT + volatility*X_0*deltaW(i, weinerMotion) + X_0;
    return(X_t(r, volatility, X_sig, j, i+1, deltaT, weinerMotion));
}

X_t_ <- function (r, volatility, X, n, deltaT, weinerMotion){
    for (i in 1:n-1){
        X <- r*X*deltaT + volatility*X*deltaW(i, weinerMotion) + X;
    }
    return(X);
} 
#T days of business, and historicalData is close price.
volatility <- function(T, historicalData){
    dailyPerformace <- c();
    n <- length(historicalData)
    for(i in 1:n-1){
        u_i <- log(historicalData[i+1]/historicalData[i]);
        dailyPerformace <- c(dailyPerformace, u_i);
    }
    s <- sqrt((1/(n-2)) * sum(dailyPerformace^2) - (1/((n-1)*(n-2))) * (sum(dailyPerformace))^2);
    return(s/sqrt(1/T));
}
#risk-free rate, measured in days.
r <- function(days, r){
    return((days/252)*r);
}

#Price Function
priceFunction <- function(typeOfInv, t, k, SimulationsOnT, T, risk){
    if(typeOfInv == "call"){
        return(exp(-risk * (T - t)) * mean(pmax(SimulationsOnT - k, 0)));
    }
    if(typeOfInv == "put"){
        return(exp(-risk * (T - t)) * mean(pmax(k - SimulationsOnT, 0)));
    }
}

#Simulate can simulate only one time, the motion of a stock at current value X, with time T.
#Ex: Simulate(0.2, 0.4, runif(1, -1e+5, 1e+5), 1, 100, 1)
Simulate <- function(r, volatility, seed, T, n, X){
    #result <- c();
    deltaT = T/n;
    set.seed(seed);
    z_norm_vector <- rnorm(n, 0, deltaT);
    weinerproccess <- Weiner(z_norm_vector);#W(n+1, 0, z_norm_vector, c());
    #timejumps <- timeJumps(n, T);
    #stockPrices <- X(r, volatility, X, n, 0, deltaT, wienerproccess, c(X));
    finalPriceOfX_ <- X_t_(r, volatility, X, n, deltaT, weinerproccess);
    return(finalPriceOfX_);
    
}

MonteCarloSimulation <- function(businessDays, x, k, t, n, historicalData, numberOfSimulations, typeOfInv, riskFreeRate){
    T = businessDays/252;
    riskFreeRate = riskFreeRate * T;
    volatility_data = volatility(businessDays, historicalData);
    simulations = c();
    seeds_history = c();
    for (i in 1:numberOfSimulations){
        seed <- runif(1, -1e+5, 1e+5);
        seeds_history <- c(seeds_history, seed);
        simulations <- c(simulations, Simulate(riskFreeRate, volatility_data, seed, T, n, x));
    }
    #priceFunction <- function(typeOfInv, t, k, SimulationsOnT, T, risk)
    return(priceFunction(typeOfInv, t, k, simulations, T, riskFreeRate));
}
# deltaW <- function (T, t, n, i, z_norm_arr){
#     deltaT <- T/n
#     t_sig <- t + deltaT
#     }
#     return(deltaW(T, t_sig, n, i-1))
#
# }