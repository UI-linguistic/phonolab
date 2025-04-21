from setuptools import setup, find_packages


def read_requirements(file):
    with open(file, 'r', encoding='utf-8') as f:
        return f.read().splitlines()


requirements = read_requirements('requirements.txt')
# dev_requirements = read_requirements('requirements-dev.txt')

setup(
    name='phonolab-backend',
    version='0.0.1',
    author='Phonolab Team',
    author_email='',
    description='Backend system for the Hooked on Phonetics project',
    package_dir={"": "src"},
    packages=find_packages(where="src", exclude=["tests", "tests.*"]),
    install_requires=requirements,
    extras_require={
        # 'dev': dev_requirements
    },
    entry_points={
        'console_scripts': [
            # later
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.8',
)
