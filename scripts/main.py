import sys

data = sys.argv[1]

def factorial(x):
    if x == 1 :
        return 1
    else:
        return x * factorial(x-1)

def two_things(a,b):
    return "Thing one: " + a + "\nThing two: " + b

print("Cusotm text")