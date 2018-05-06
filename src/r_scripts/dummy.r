dummyFunc <- function(x, y, z){
  return(x*y/length(z)*tail(z, n=1));
}

dummyFunc2 <-function(x, y){
    return(x-y);
}

dummyFunc3 <- function(x, y, z){
    return(sum(z) + x + y);
}

dummyFunc4 <- function(x, y, z){
    if (y == "hello"){
        return(1 + x + sum(z));
    }
    else{
        return(0);
    }
}
