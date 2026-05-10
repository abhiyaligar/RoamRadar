"""merge_heads

Revision ID: 847f0ad981ca
Revises: 0565c6e95702, d134fc952b26
Create Date: 2026-05-10 15:11:24.633178

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '847f0ad981ca'
down_revision: Union[str, Sequence[str], None] = ('0565c6e95702', 'd134fc952b26')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
