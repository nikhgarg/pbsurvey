import numpy as np

# For ward 2, we want to create random valid knapsacks

#All ward2 projects in a dictionary/lists of lists
projects = [
    ["Cook Rd. Sidewalk Extension", 420729],
    ["Bus Shelters with Reclaimed Art and Solar Panels", 395757],
    ["Sidewalk along E. Pettigrew St. between Driver St. and S. Plum St", 354652],
    ["Burton Park Improvements", 309309],
    ["Bus Shelters on Fayetteville St.", 158620],
    ["Technology for Durham Public Middle and High Schools", 134784],
    ["Wi-Fi Hotspot Picnic Table", 123750],
    ["Durham Housing Authority (DHA) LED Lighting and Security Cameras", 113300],
    ["LGBTQ Youth Center (lesbian, gay, bisexual, transgender, and questioning)", 113300],
    ["Accessible Ramps for People with Disabilities", 56650]
]


def get_knapsack_from_rankorder(order, budget= 800000):
    accepted_indices = []
    for i in range(len(order)):
        if projects[order[i]][1] <= budget:
            budget -= projects[order[i]][1]
            accepted_indices.append(order[i])
    print (accepted_indices, budget, sum([projects[order[i]][1] for i in range(len(projects)) if order[i] not in accepted_indices]))
    return ",".join([str(x) for x in sorted(accepted_indices)])


def get_many_valid_knapsacks(count = 5000):
    knapsacks = []
    project_order = list(range(len(projects)))
    for _ in range(count):
        np.random.shuffle(project_order)
        kp = get_knapsack_from_rankorder(project_order)
        knapsacks.append(kp)
    knapsacks = list(sorted(list(set(knapsacks))))
    print(len(knapsacks))
    print(knapsacks)
    print([[int(y) for y in x.split(',')] for x in knapsacks])

get_many_valid_knapsacks()

#TODO from those, create a bunch of random valid knapsacks:
    #randomize the rank order, then create a knapack
    #Outuput a list of unique knapsacks
