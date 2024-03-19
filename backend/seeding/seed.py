import random
import json
import os
from django.db.models import QuerySet
from accounts.models import User
from django.contrib.auth.models import Group
from academics.models import Course, Subject
from accounts.groups import AdminGroup, StaffGroup, StudentGroup, DeveloperGroup


def seed():
    groupAdmin = Group.objects.create(
        name=AdminGroup.name,
        id=AdminGroup.id,
    )
    groupStudent = Group.objects.create(
        name=StudentGroup.name,
        id=StudentGroup.id,
    )
    grouDeveloper = Group.objects.create(
        name=DeveloperGroup.name,
        id=DeveloperGroup.id,
    )
    grouStaff = Group.objects.create(
        name=StaffGroup.name,
        id=StaffGroup.id,
    )
    user1 = User.objects.create_user(
        username="admin",
        email="admin@example.com",
        is_staff=True,
        is_superuser=True,
        password="admin.password@1234"
    )
    user1.groups.set([grouDeveloper])
    user2 = User.objects.create_user(
        username="user1",
        email="user1@example.com",
        password="user1.password@1234"
    )
    user2.groups.set([grouDeveloper])
    user3 = User.objects.create_user(
        username="user2",
        email="user2@example.com",
        password="user2.password@1234"
    )
    user3.groups.set([grouDeveloper])
    Subject.objects.create(
        title="math"
    )
    Subject.objects.create(
        title="phys"
    )
    Subject.objects.all()
    subjects_ids = Subject.objects.values_list('id', flat=True)
    Course.objects.create(
        title="Coures 152",
        image='files/1_YunI3ChUVMlpmFzo75FczQ.png',
        subject_id=random.choice(subjects_ids)
    )

    print("Seed data created successfully.")


if __name__ == "__main__":
    seed()
