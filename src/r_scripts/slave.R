#Weiner Motion
W <- function(i, j, z_norm_vector, vector){
    if (j == 0){
        vector <- c(vector, 0);
        return(W(i, j+1, z_norm_vector, vector));
    }
    if (j == i){
        return(vector);
    }
    W_sig <- vector[j] + z_norm_vector[j];
    vector <- c(vector, W_sig);
    return(W(i, j+1, z_norm_vector, vector));
}
#delta Weiner Motion
deltaW <- function(j, weinerMotion){
    return(weinerMotion[j] - weinerMotion[j-1]);
}
#Simulacion activo X a tiempo t_j
X_t <- function(r, volatility, j, deltaT, deltaW){
    
}


# deltaW <- function (T, t, n, i, z_norm_arr){
#     deltaT <- T/n
#     t_sig <- t + deltaT
#     }
#     return(deltaW(T, t_sig, n, i-1))
#
# }