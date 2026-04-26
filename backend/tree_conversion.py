import ast

def conversion(node: ast.AST):
    tree = {
        'type': node.__class__.__name__,
        'children': []
    }

    #handle module and expr nodes
    if isinstance(node, ast.Module):
        for item in node.body:
            return conversion(item)
    
    elif isinstance(node, ast.Expr):
        return conversion(node.value)
    
    #Boolean Operation handling
    elif isinstance(node, ast.Call):
        
        #Name of the operation
        if isinstance(node.func, ast.Name):
            tree['name'] = node.func.id
            tree['type'] = 'Operation'

        #arguments of the operation
        for arg in node.args:
            child = conversion(arg)
            tree['children'].append(child)

    #variable name    
    elif isinstance(node, ast.Name):
        tree['type'] = 'Variable'
        tree['name'] = node.id

    return tree