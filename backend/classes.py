import ast

class Stack:
    def __init__(self):
        self.stack = []

    def push(self, element):
        self.stack.append(element)
    
    def pop(self):
        if self.isEmpty():
            return IndexError
        return self.stack.pop()

    def isEmpty(self):
        return self.stack == 0
    
    def size(self):
        return len(self.stack)
    
            

            
            
    