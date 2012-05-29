#!/usr/bin env python

from __future__ import division
from MakoWrapper import render_template
from philo_helpers import make_query_link
import json

def frequency(h, path, path_components, db, dbname, q, environ):
    hits = db.query(q["q"],q["method"],q["arg"],**q["metadata"])
    if q["format"] == "json":
        field, counts = generate_frequency(hits,q,db)
        l = len(counts)
        wrapper = {"length":l,"result":[],"field":field}
        for k,v in counts:
            q["metadata"][field] = '"%s"' % k or "NULL"
            url = make_query_link(q["q"],q["method"],q["arg"],**q["metadata"])
            table_row = {"label":k,"count":v,"url":url}
            wrapper["result"].append(table_row)
        return json.dumps(wrapper,indent=1)
        
    else:
        return render_template(results=hits,db=db,dbname=dbname,q=q,generate_frequency=generate_frequency,h=h, template_name='frequency.mako')

def generate_frequency(results, q, db):
    field = q["field"]
    if field == None:
        field = 'title'
    counts = {}
    for n in results:
        label = n[field]
        if label == '':
            label = 'NULL'
        if label in counts:
            counts[label] += 1
        else:
            counts[label] = 1
    if q['rate'] == 'relative':
        conn = db.toms.dbh ## make this more accessible 
        c = conn.cursor()
        for label, count in counts.iteritems():
            counts[label] = relative_frequency(field, label, count, c)
    return field, sorted(counts.iteritems(), key=lambda x: x[1], reverse=True)
    
def relative_frequency(field, label, count, c):
    query = '''select sum(word_count) from toms where %s="%s"''' % (field, label)
    c.execute(query)
    return count / c.fetchone()[0] * 10000
