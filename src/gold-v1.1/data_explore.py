import jsonlines
import numpy as np

data = []

with jsonlines.open('./train.jsonl') as reader:
    for obj in reader:
        data.append(obj)

answer_lens = []
for v in data:
    line = " ".join(v['answers'])
    answer_lens.append(len(line.split()))

print("max:", np.max(answer_lens))
print("min:", np.min(answer_lens))
print("mean:", np.mean(answer_lens))
print("std:", np.std(answer_lens))
# percentiles
for i in range(30, 101, 5):
    print("{}%: {}".format(i, np.percentile(answer_lens, i)))