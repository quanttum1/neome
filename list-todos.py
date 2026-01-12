import os

class Todo:
    label = ''
    file = ''
    title = ''
    deps = None

    # This is needed because python is a shitty language :)
    def __init__(self):
        self.deps = []

def is_file_ignored(path, name):
    if path.startswith('./.git') or \
        path.startswith('./frontend/node_modules/') or \
        path.startswith('./frontend/dist/') or \
        name.startswith('.'):
            return True

    return False


def get_todos_from_file(path, name):
    if is_file_ignored(path, name):
        return []

    lines = open(path).read().splitlines()
    comment_lines = []

    for linenumber in range(len(lines)):
        line = lines[linenumber]

        def add_comment_line(comment_line):
            nonlocal comment_lines
            comment_lines += [(comment_line, f'{path}:{linenumber + 1}')]

        if name.endswith('.js') or name.endswith('.jsx'):
            if '//' in line:
                # It looks scary, but it just extracts the comment
                comment = '//'.join(line.split('//')[1:])
                comment = comment.strip()

                add_comment_line(comment)

        if name.endswith('.jsx'):
            # TODO(2026-01-12 20:13:34): support multiline comments enclosed in {/* */}
            if '{/*' in line:
                comment = line.split('{/*')[1]
                comment = comment.split('*/}')[0]
                comment = comment.strip()

                add_comment_line(comment)

        if name.endswith('.cs'):
            # TODO(2026-01-12 19:57:30): add support for C# files in `list-todos.py`
            pass

        if name.endswith('.py'):
            if line.strip().startswith('#'):
                comment = '#'.join(line.split('#')[1:])
                comment = comment.strip()
                add_comment_line(comment)

        if name == 'TODOs':
            if not line.startswith('#'):
                add_comment_line(line)
            if line.startswith('('):
                add_comment_line(f'TODO{line}')

    return comment_lines


def get_todo_lines():
    files = [] # Getting all of the files in the current dir including those in subdirs
    for root, dirs, filenames in os.walk("."):
        for name in filenames:
            files.append([os.path.join(root, name), name])

    todo_lines = []
    for path, name in files:
        todo_lines += get_todos_from_file(path, name)

    return todo_lines


def get_todos(todo_lines):
    todos = []

    for line, file in todo_lines:
        todo = Todo()
        todo.file = file

        if line.startswith('TODO(') and '):' in line:
            todo.label = line.split('):')[0].removeprefix('TODO(')
            todo.title = line.split('):')[1].strip()
            todos += [todo]
            continue

        if line.startswith('TODO:'):
            todo.title = line.removeprefix('TODO:').strip()
            todos += [todo]
            continue

        if line.startswith('deps:'):
            deps = line.removeprefix('deps:').split(',')

            for dep in deps:
                dep = dep.strip()
                dep = dep.removeprefix('(')
                dep = dep.removesuffix(')')

                todos[len(todos) - 1].deps += [dep]

    return todos


def is_label_in_todos(todos, label):
    for todo in todos:
        if todo.label == label:
            return True
    return False

def main():
    todo_lines = get_todo_lines()
    todos = get_todos(todo_lines)

    for todo in todos:
        if not any([is_label_in_todos(todos, dep) for dep in todo.deps]):
            print(f'{todo.file}: {todo.title}')


if __name__ == "__main__":
    main()
