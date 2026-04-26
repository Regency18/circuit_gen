from pyeda.inter import espresso_exprs, expr
from classes import Stack
from tree_conversion import conversion
import ast

eq = "abd'+abc' + cbd + ae + bd + cdbe"

class Equation:
   def __init__(self, equation):
      self.eq = equation
      self.changed_eq = ""
       
   def strip_eq(self):
      cleaned_eq = self.eq.strip().replace(" ", "")
      return cleaned_eq

   def split_equation(self):
   
   #init Stack class
      parenthesis = Stack()
      eq = self.strip_eq()
      
      i = 0
      while i < len(eq) - 1:
         # Handle complement operator '
         if eq[i] == "'":
            if eq[i-1].isalpha():
               eq = eq[:i-1] + "~" + eq[i-1] + eq[i+1:]
               # length unchanged, no index shift needed
            elif eq[i-1] == ")":
               index = parenthesis.pop()
               eq = eq[:index] + "~" + eq[index:i] + eq[i+1:]
               # ' removed, ~ inserted at index: net change = 0
            i += 1
            continue  # re-evaluate current position after rewrite

         # Insert & for implicit multiplication between alpha and next token
         if eq[i].isalpha():
            nxt = eq[i+1]
            if nxt not in ("+", ")", "&", "|", "~", "'"):
               eq = eq[:i+1] + "&" + eq[i+1:]
               i += 1
               continue
            elif nxt == "+":
               eq = eq[:i+1] + "+" + eq[i+2:]
               i += 1
               continue

         # Track parentheses
         if eq[i] == "(":
               parenthesis.push(i)

         if eq[i] == ")":
            if i + 1 < len(eq):
               nxt = eq[i+1]
               if nxt == "+":
                  eq = eq[:i+1] + "+" + eq[i+2:]
               elif nxt == "(":
                  eq = eq[:i+1] + "&" + eq[i+1:]
               elif nxt.isalpha():
                  eq = eq[:i+1] + "&" + eq[i+1:]

         i += 1

      # Handle complement at end of string
      if eq[-1] == "'" and eq[-2].isalpha():
         eq = eq[:-2] + "~" + eq[-2]
      elif eq[-1] == "'" and eq[-2] == ")":
         index = parenthesis.pop()
         eq = eq[:index] + "~" + eq[index:-1]

      self.changed_eq = eq
         

   def string_to_dict(self):
      self.split_equation()
      eq = self.changed_eq.replace("+", "|")

      #simplify eq
      expression = expr(eq)
      f_min, = espresso_exprs(expression.to_dnf())

      #turn into python ast
      tree = ast.parse(f"{f_min}")

      #turn into json
      return conversion(tree)



   
